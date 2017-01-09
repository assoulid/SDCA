import swiftclient

# TODO : retirer le mot de passe en clair
user = 'groupe4'
password = 'zH0lJRtRhVU='
authurl ='http://10.11.50.26:5000/v3/auth/tokens'

@app.route("/<id>"); 
def swift_get(id):
    try:
        swift_connexion = swiftclient.client.Connection(
        	authurl=authurl, 
        	user=user, 
        	key=password 
    	)
        object_body = swift_connexion.get_object('prizes_container', id)
        swift_connexion.close()

        # decodage de l'image
        
        img = object_body["img"].encode("ascii");
        img = base64.b64decode(img);

        resp = jsonify(object_body)
        resp.status_code = 200

        resp.headers["Content-Type"] = "image/jpeg"

        add_headers(resp)
        return resp

    except swiftclient.exceptions.ClientException:
        print(traceback.format_exc())
