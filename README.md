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
* voir les instances openstack : http://10.11.50.26/project/instances/
* se connecter aux instance par ssh : `ssh -i keys/cle_bastion ubuntu@<ip>`
* pour se connecter, utiliser les identifiants reçus et spécifier le groupe default

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

La commande suivante devrait marcher. Elle liste les vm de l'openstack.
```
openstack server list
```

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

Pour chaque groupe d'hote, un playbook ansible est défini. Les playbooks ansible permettent de spécifier des taches d'installation ed logiciels.

**Pour le groupe [all_nodes]**: on installe docker et consul et on démarre le service docker.

**Pour le groupe [consul_server]**: on démarre l'agent consul en mode serveur.

**Pour les groupes des microservices (eg :[b])** le processus est comme suit:

 1. On envoie les répértoires du microservice
 2. On fait un build de l'image docker du microservice
 3. On lance le conteneur docker
 4. On lance l'agent consul en tant que client et on rejoint le cluster
 5. On enregistre le service, qui est par la suite découvrable par les différentes instances

Pour plus d'informations sur l'utilisation des playbooks ansible, voir: http://docs.ansible.com/ansible/playbooks.html
## Localisation des microservices

Consul rend simple l'enregistrement et la découverte des services via une interface DNS ou HTTP.
L'architecture d'un cluster consul est composée de plusieurs agents avec au moins un agent en mode serveur et les autres en mode client.

Pour plus d'informations, voir: https://www.consul.io/docs/agent/basics.html

La commande suivante permet de lister les services enregistrés dans le cluster:
`curl http://localhost:8500/v1/catalog/services`

La commande suivante donne des infiormations sur un service particulier:
`curl http://localhost:8500/v1/catalog/service/<nom_service>`

N.B: Les commandes doivent etres lancées à partir d'une instance ayant lancé un agent consul et ayant rejoint le cluster.

## License

This project is licensed under the terms of the
[MIT license](http://opensource.org/licenses/MIT).
