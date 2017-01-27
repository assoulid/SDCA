# SDCA
## Installer openstackClient sur les bastions

```
ssh -i keys/cle_bastion ubuntu@<ip>
sudo apt install python-pip && sudo pip install python-openstackclient && sudo pip install python-heatclient
```

Depuis votre ordi : `scp -i keys/cle_bastion ressources/project4-openrc.sh ubuntu@<ip>`

Puis depuis le bastion :

 -> `git clone https://github.com/assoulid/SDCA.git`

 -> `source SDCA/ressources/project4-openrc.sh` et entrer le mdp (envoyé sur vos mails)

 -> `source SDCA/ressources/mailgun_env.sh`


## Script de provisionnement des instances

La commande suivante permet de lancer le script de provisionnement des instances pour les différents microservices
```
./scripts/provision.py
```

Ce script permet d'automatiser la création des instances en utilisant une template heat qui est le principal composant d'orchestration d'openstack.
La template utilisée est templates/main.yaml.

La template définit des outputs qui sont les adresses ip des différentes instances crées.

Le nombre d'instances pour les différents microservices est configurable. On peut donc opter pour plusieurs instances par microservice pour un gain en terme de disponibilité.

La template définit également des ressources pour les serveurs consul. Consul sera principalement utilisé pour l'enregistrement et la découverte de microservices.

Le script prépare le fichier /etc/ansible/hosts qui permet de définir des groupes de hotes. Ce fichier sera après utilisé par ansible pour automatiser le déploiement logiciel.

Ci-dessous un exemple du fichier /etc/ansible/hosts créé par le script.

```
[b]
10.0.1.58
[w]
10.0.1.59
[consul_server]
10.0.1.6
[all_nodes]
10.0.1.58
10.0.1.59
10.0.1.6
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
