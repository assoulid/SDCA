#!/bin/bash

rm ~/.ssh/known_hosts

~/scan_hosts

#Run common playbook
echo 'Running all_nodes.yaml playbook. See all_nodes.out for command output'
ansible-playbook ../playbooks/all_nodes.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > all_nodes.out

#Run consul_server playbook
echo 'Running consul_server.yaml playbook. See consul_server.out for command output'
ansible-playbook ../playbooks/consul_server.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > consul_server.out

echo 'Running w.yaml and b.yaml and mysql.yaml and appliWeb.yaml playbooks in parallel. See {w,b,mysql,appliWeb}.out for commands output'
#Run w playbook
ansible-playbook ../playbooks/w.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > w.out &

#Run b playbook
ansible-playbook ../playbooks/b.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > b.out &

#Run mysql playbook
ansible-playbook ../playbooks/mysql.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > mysql.out &

#Run appliWeb playbook
ansible-playbook ../playbooks/appliWeb.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > appliWeb.out &
