#!/bin/bash

rm ~/.ssh/known_hosts

~/scan_hosts

#Run common playbook
echo 'Running all_nodes.yaml playbook. See all_nodes.out for command output'
ansible-playbook ../playbooks/all_nodes.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > all_nodes.out 2>&1

#Run consul_server playbook
echo 'Running consul_server.yaml playbook. See consul_server.out for command output'
ansible-playbook ../playbooks/consul_server.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > consul_server.out 2>&1

#Run galera all nodes playbook
echo 'Running galera_all_nodes.yaml playbook. See galera_all_nodes.out for command output'
ansible-playbook ../playbooks/galera_all_nodes.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > galera_all_nodes.out 2>&1

#Run galera first node playbook
echo 'Running galera_first_node.yaml playbook. See galera_first_node.out for command output'
ansible-playbook ../playbooks/galera_first_node.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > galera_first_node.out 2>&1

echo 'Running w.yaml and b.yaml and p.yaml and s.yaml and i.yaml and appliWeb.yaml playbooks in parallel. See {w,b,p,s,i,appliweb}.out for commands output'
#Run w playbook
ansible-playbook ../playbooks/w.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > w.out 2>&1 &
W=$!

#Run b playbook
ansible-playbook ../playbooks/b.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > b.out 2>&1 &
B=$!

#Run p playbook
ansible-playbook ../playbooks/p.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > p.out 2>&1 &
P=$!

#Run s playbook
ansible-playbook ../playbooks/s.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > s.out 2>&1 &
S=$!

#Run appliWeb playbook
ansible-playbook ../playbooks/appliWeb.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > appliWeb.out 2>&1 &
AW=$!

#Run i playbook
ansible-playbook ../playbooks/i.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > i.out 2>&1 &
I=$!


#Run galera other node playbook
echo 'Running galera_other_node.yaml playbook. See galera_other_node.out for command output'
ansible-playbook ../playbooks/galera_other_node.yaml --ssh-common-args='-o IdentityFile=~/.ssh/cle_bastion' > galera_other_node.out 2>&1 &
GO=$!

wait $W
wait $B
wait $P
wait $S
wait $I
wait $AW
wait $GO


echo "------------Deployment finished------------"