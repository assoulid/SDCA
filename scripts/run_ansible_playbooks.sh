#!/bin/bash

rm ~/.ssh/known_hosts

~/scan_hosts

#Run common playbook
echo 'Running all_nodes.yaml playbook'
ansible-playbook ../playbooks/all_nodes.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > all_nodes.out

#Run consul_server playbook
echo 'Running consul_server.yaml playbook'
ansible-playbook ../playbooks/consul_server.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > consul_server.out

echo 'Running w.yaml and b.yaml playbooks in parallel'
#Run w playbook
ansible-playbook ../playbooks/w.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > w.out &

#Run b playbook
ansible-playbook ../playbooks/b.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > b.out &