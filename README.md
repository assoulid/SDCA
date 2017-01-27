# SDCA
## Installer openstackClient sur les bastions
```
sudo apt install python-pip && sudo pip install python-openstackclient && sudo pip install python-heatclient
```

Depuis bastion :

 -> `git clone https://github.com/assoulid/SDCA.git`

 -> `source SDCA/ressources/project4-openrc.sh` et entrer le mdp (envoyé sur vos mails)

 -> `source SDCA/ressources/mailgun_env.sh`


## Script de provisionnement des instances

La commande suivante permet de lancer le script de provisionnement des instances pour les différents microservices
```
./scripts/provision.py
```

Pour plus d'informations sur l'utilisation des templates heat, voir: https://wiki.openstack.org/wiki/Heat


## Script de déploiement logiciel
La commande suivante permet de lancer le script de déploiement logiciel
```
./scripts/run_ansible_playbooks.sh
```
## License

This project is licensed under the terms of the
[MIT license](http://opensource.org/licenses/MIT).
