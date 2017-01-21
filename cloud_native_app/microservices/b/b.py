#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""b service"""
import json
import logging
import os
import pprint
import random
import sys
from logging.handlers import RotatingFileHandler

import config
import requests
from flask import Flask
from flask import jsonify
from mysql import connector

# Initialise Flask
app = Flask(__name__)
app.debug = True

# Affect app logger to a global variable so logger can be used elsewhere.
config.logger = app.logger
KEYSTONE_URL = "http://10.11.50.26:5000/v3/auth/tokens"
SWIFT_CONTAINER = "prizes_container"


@app.route("/", methods=["GET"])
def api_root():
    """Used for consul health checks"""
    data = {
        "Service": config.b.NAME,
        "Version": config.b.VERSION
    }

    resp = jsonify(data)
    resp.status_code = 200
    add_headers(resp)
    return resp


@app.route("/play/<id>")
def api_play(id):
    try:
        w_instance_host, w_port = get_service_instance('w')
        result = requests.get('http://{}:{}/play/{}'.format(w_instance_host, w_port, id)).text

        player_won = random.choice([True, False])

        if player_won:
            send_result_to_swift(id, result)

        update_user_status(id, player_won)

    except:
        resp = get_response(False, None)
        return resp

    resp = get_response(True, player_won)
    return resp


def get_response(success, player_won):
    resp = jsonify({"message": "done" if success else "failed",
                    "has_won": player_won})
    resp.status_code = 200 if success else 500
    add_headers(resp)
    return resp


def send_result_to_swift(id, result):
    swift_endpoint, token = get_keystone_token()
    requests.put(swift_endpoint + "/{}/{}".format(SWIFT_CONTAINER, id)
                 , data=result
                 , headers={'Content-Type': 'application/json',
                            'X-Auth-Token': token})


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


def update_user_status(id, player_won):
    mysql_instance_host, mysql_port = get_service_instance('mysql')

    mysql_connection = connector.connect(host=mysql_instance_host, port=mysql_port,
                                         user='root', password='group4',
                                         database='prestashop')

    user_status_query = "UPDATE has_played set has_played = %s , has_won = %s where id_customer = %s"

    cursor = mysql_connection.cursor()
    cursor.execute(user_status_query, (True, player_won, id))
    mysql_connection.commit()

    mysql_connection.close()


def get_service_instance(service_name):
    service_health_info = requests.get('http://localhost:8500/v1/health/service/{}'.format(service_name)).json()

    passing_hosts = list(filter(
        lambda x: len(
            list(filter(lambda y: y["ServiceName"] == service_name and y["Status"] == "passing", x["Checks"]))) != 0,
        service_health_info))

    if len(passing_hosts) == 0:
        raise Exception("No available {} instances".format(service_name))

    host, port = passing_hosts[0]["Node"]["Address"], passing_hosts[0]["Service"]["Port"]

    return host, port


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
