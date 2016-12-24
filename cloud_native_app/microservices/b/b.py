#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""Testing service"""

import logging
import os
import pprint
import sys
from logging.handlers import RotatingFileHandler
import requests
from flask import Flask
from flask import jsonify

import config

# Initialise Flask
app = Flask(__name__)
app.debug = True

# Affect app logger to a global variable so logger can be used elsewhere.
config.logger = app.logger


@app.route("/", methods=["GET"])
def api_root():
    """Root url, provide service name and version. Used for consul health checks"""
    data = {
        "Service": config.w.NAME,
        "Version": config.w.VERSION
    }

    resp = jsonify(data)
    resp.status_code = 200

    resp.headers["AuthorSite"] = "https://github.com/uggla/openstack_lab"

    add_headers(resp)
    return resp


@app.route("/test")
def api_test():
    config.logger.info("*** Start testing ***")
    data = {"message": "Hello"}
    resp = jsonify(data)
    resp.status_code = 200
    config.logger.info("*** End testing")
    add_headers(resp)
    return resp


@app.route("/play/<id>")
def api_play(id):
    w_instance = get_w_host()
    w_response_raw = requests.get('http://{}:8090/play/{}'.format(w_instance, id)).json()
    resp = jsonify(w_response_raw)
    resp.status_code = 200
    return resp


def get_w_host():
    w_info = requests.get('http://localhost:8500/v1/catalog/service/w').json()
    """
    w_info example output:
    [
        {
            "Address": "10.0.1.78",
            "CreateIndex": 62,
            "ModifyIndex": 409,
            "Node": "w-0",
            "ServiceAddress": "",
            "ServiceEnableTagOverride": false,
            "ServiceID": "w",
            "ServiceName": "w",
            "ServicePort": 8090,
            "ServiceTags": [],
            "TaggedAddresses": {
                "lan": "10.0.1.78",
                "wan": "10.0.1.78"
            }
        }
    ]
    """
    host = w_info[0]['Address']
    return host


def configure_logger(logger, logfile):
    """Configure logger"""
    formatter = logging.Formatter(
        "%(asctime)s :: %(levelname)s :: %(message)s")
    file_handler = RotatingFileHandler(logfile, "a", 1000000, 1)

    # Add logger to file
    if config.b.conf_file.get_b_debug().title() == 'True':
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
    app_logfile = "b.log"

    # Change diretory to script one
    try:
        os.chdir(os.path.dirname(sys.argv[0]))
    except FileNotFoundError:
        pass

    # Define a PrettyPrinter for debugging.
    pp = pprint.PrettyPrinter(indent=4)

    # Initialise apps
    config.initialise_b()

    # Configure Flask logger
    configure_logger(app.logger, app_logfile)

    config.logger.info("Starting %s", config.b.NAME)
    app.run(port=int(config.b.conf_file.get_b_port()), host='0.0.0.0')
