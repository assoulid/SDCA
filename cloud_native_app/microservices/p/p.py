#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import base64
import json
import logging
import os
import pprint
import sys
from logging.handlers import RotatingFileHandler

import config
import requests
from flask import Flask
from flask import jsonify

# Initialise Flask
from flask import make_response

app = Flask(__name__)
app.debug = True

# Affect app logger to a global variable so logger can be used elsewhere.
config.logger = app.logger

KEYSTONE_URL = "http://10.11.50.26:5000/v3/auth/tokens"
SWIFT_CONTAINER = "prizes_container"


@app.route("/<id>")
def swift_get(id):
    object_body = get_image_from_swift(id)

    # decodage de l'image

    img = object_body["img"].encode("ascii")
    img = base64.b64decode(img)

    resp = make_response(img)
    resp.status_code = 200

    resp.headers["Content-Type"] = "image/jpeg"

    add_headers(resp)
    return resp


def get_image_from_swift(id):
    swift_endpoint, token = get_keystone_token()
    image = requests.get(swift_endpoint + "/{}/{}".format(SWIFT_CONTAINER, id), headers={'X-Auth-Token': token}).json()
    return image


def get_keystone_token():
    keystone_request_body = \
        {
            'auth': {
                'identity': {
                    'methods': ['password'],
                    'password': {
                        'user': {
                            'name': 'groupe4',
                            'domain': {
                                'name': 'Default'
                            },
                            'password': os.environ['OS_PASSWORD']
                        }
                    }
                }
            }
        }

    keystone_response = requests.post(KEYSTONE_URL, headers={'content-type': 'application/json'},
                                      data=json.dumps(keystone_request_body))

    token = keystone_response.headers['X-Subject-Token']

    swift_endpoint = list(filter(lambda x: x["interface"] == "public",
                                 list(filter(lambda c: c['name'] == 'swift',
                                             keystone_response.json()['token']['catalog']))[0][
                                     'endpoints']))[0]['url']

    return swift_endpoint, token


@app.route("/", methods=["GET"])
def api_root():
    """Root url, provide service name and version"""
    data = {
        "Service": config.p.NAME,
        "Version": config.p.VERSION
    }

    resp = jsonify(data)
    resp.status_code = 200

    resp.headers["AuthorSite"] = "https://github.com/uggla/openstack_lab"

    add_headers(resp)
    return resp


def configure_logger(logger, logfile):
    """Configure logger"""
    formatter = logging.Formatter(
        "%(asctime)s :: %(levelname)s :: %(message)s")
    file_handler = RotatingFileHandler(logfile, "a", 1000000, 1)

    # Add logger to file
    if config.p.conf_file.get_p_debug().title() == 'True':
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)


def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')


if __name__ == "__main__":
    # Vars
    app_logfile = "p.log"

    # Change diretory to script one
    try:
        os.chdir(os.path.dirname(sys.argv[0]))
    except FileNotFoundError:
        pass

    # Define a PrettyPrinter for debugging.
    pp = pprint.PrettyPrinter(indent=4)

    # Initialise apps
    config.initialise_p()

    # Configure Flask logger
    configure_logger(app.logger, app_logfile)

    config.logger.info("Starting %s", config.p.NAME)
    app.run(port=int(config.p.conf_file.get_p_port()), host='0.0.0.0')
