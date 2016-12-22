#!/usr/bin/python3

import json
import os
import subprocess
import time

STACK_NAME = "G4_Stack"
B_HEAT_PATH = os.path.abspath("../templates/main.yaml")

subprocess.call("openstack stack create --enable-rollback -t {} {}".format(B_HEAT_PATH, STACK_NAME), shell=True)


def get_stack_status():
    json_stack_state = json.loads(
        subprocess.check_output("openstack stack show -f json {}".format(STACK_NAME), shell=True).decode())
    return json_stack_state


stack_status = get_stack_status()

# Polling for stack status
while stack_status["stack_status"] != "CREATE_COMPLETE":
    time.sleep(2)
    stack_status = get_stack_status()
    if stack_status["stack_status"] == "CREATE_FAILED":
        print("Error deploying stack !")
        exit(-1)

# Extract instances ips
b_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "b", stack_status["outputs"])))[0]
w_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "w", stack_status["outputs"])))[0]
consul_server_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "consul_server", stack_status["outputs"])))[0]

with open("/etc/ansible/hosts", "w") as hosts:
    hosts.write("[b]\n")
    for b in b_instances_ips:
        hosts.write(b + "\n")

    hosts.write("[w]\n")
    for w in w_instances_ips:
        hosts.write(w + "\n")

    hosts.write("[consul_server]\n")
    for cs in consul_server_instances_ips:
        hosts.write(cs + "\n")

    hosts.write("[all_nodes]\n")
    for instance in b_instances_ips + w_instances_ips + consul_server_instances_ips:
        hosts.write(instance + "\n")

with open(os.path.expanduser("~/scan_hosts"), "w") as sh:
    for instance in b_instances_ips + w_instances_ips + consul_server_instances_ips:
        sh.write("ssh-keyscan -t rsa {} >> ~/.ssh/known_hosts\n".format(instance))

os.chmod(os.path.expanduser("~/scan_hosts"), 0o777)
