import base64
import logging
import os
import pprint
import sys
import traceback
from logging.handlers import RotatingFileHandler

import config
import swiftclient
from flask import Flask
from flask import Response
from flask import jsonify

# Initialise Flask
app = Flask(__name__)
app.debug = True

# Affect app logger to a global variable so logger can be used elsewhere.
config.logger = app.logger

# TODO : retirer le mot de passe en clair
user = 'groupe4'
password = 'zH0lJRtRhVU='
authurl = 'http://10.11.50.26:5000/v3/auth/tokens'


@app.route("/<id>")
def swift_get(id):
    try:
        swift_connexion = swiftclient.client.Connection(
            authurl=authurl,
            user=user,
            key=password
        )
        headers, object_body = swift_connexion.get_object('prizes_container', id)
        swift_connexion.close()

        # decodage de l'image

        img = object_body["img"].encode("ascii")
        img = base64.b64decode(img)

        resp = Response(img)
        resp.status_code = 200

        resp.headers["Content-Type"] = "image/jpeg"

        add_headers(resp)
        return resp

    except swiftclient.exceptions.ClientException:
        print(traceback.format_exc())

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
    if (config.w.conf_file.get_w_debug().title() == 'True'):
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
