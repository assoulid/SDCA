# SDCA

## Travailler sur son ordi perso

Installer openvpn :
```
sudo apt-get install openvpn
```

Lancer le serveur :
```
cd lab
sudo openvpn --config vpnlab4.conf
```

A partir de là, on peut :
* voir les instances openstack : https://10.11.50.26/project/instances/
* se connecter aux instance par ssh : `ssh -i keys/cle_bastion ubuntu@<ip>`

## Installer openstackClient sur les bastions

```
ssh -i keys/cle_bastion ubuntu@<ip>
sudo apt-get install python-openstackclient
```

Depuis votre ordi : `scp -i keys/cle_bastion ressources/project4-openrc.sh ubuntu@<ip>`

Puis depuis le bastion : `source project4-openrc.sh` et entrer le mdp (envoyé sur vos mails)

La commande suivante devrait marcher. Elle liste les vm de l'openstack.
```
openstack server list --insecure
```