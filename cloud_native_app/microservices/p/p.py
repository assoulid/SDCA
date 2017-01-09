import swiftclient

user = 'username'
password = 'password'
authurl ='http://10.11.50.26:5000/v3/auth'

try:
    swift_connexion = swiftclient.client.Connection(
    	authurl=authurl, 
    	user=user, 
    	key=password 
	)
    object_body = swift_connexion.get_object('prizes_container', id)
    swift_connexion.close()
    f = open('prize.png', 'wb')
    f.write(object_body)
    f.close()
except swiftclient.exceptions.ClientException:
    print(traceback.format_exc())