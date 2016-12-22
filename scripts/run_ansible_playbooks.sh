#!/bin/bash

rm ~/.ssh/known_hosts

~/scan_hosts

#Run common playbook
ansible-playbook ../playbooks/all_nodes.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion'

#Run consul_server playbook
ansible-playbook ../playbooks/consul_server.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion'

#Run w playbook
ansible-playbook ../playbooks/w.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion'

#Run b playbook
ansible-playbook ../playbooks/b.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion'