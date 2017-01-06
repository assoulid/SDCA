#!/usr/bin/python3

import json
import os
import subprocess
import time

STACK_NAME = "G4_Stack"
HOT_PATH = os.path.abspath("../templates/main.yaml")

CONSUL_INSTANCES_COUNT = 1
B_INSTANCES_COUNT = 1
W_INSTANCES_COUNT = 1
MYSQL_INSTANCES_COUNT = 1
APPLIWEB_INSTANCES_COUNT = 1

subprocess.call(
    "openstack stack create -t {} {} --parameter b_instances_count={} --parameter w_instances_count={} --parameter mysql_instances_count={} --parameter consul_server_instances_count={} --parameter appliWeb_instances_count={}".format(
        HOT_PATH, STACK_NAME, B_INSTANCES_COUNT, W_INSTANCES_COUNT, MYSQL_INSTANCES_COUNT, CONSUL_INSTANCES_COUNT, APPLIWEB_INSTANCES_COUNT),
    shell=True)


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

print("Stack creation successful.")

# Extract instances ips
b_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "b", stack_status["outputs"])))[0]
w_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "w", stack_status["outputs"])))[0]
consul_server_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "consul_server", stack_status["outputs"])))[0]
mysql_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "mysql", stack_status["outputs"])))[0]
appliWeb_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "mysql", stack_status["outputs"])))[0]

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

    hosts.write("[mysql]\n")
    for ms in mysql_instances_ips:
        hosts.write(ms + "\n")

    hosts.write("[appliWeb]\n")
    for aw in appliWeb_instances_ips:
        hosts.write(aw + "\n")

    hosts.write("[all_nodes]\n")
    for instance in b_instances_ips + w_instances_ips + consul_server_instances_ips + mysql_instances_ips:
        hosts.write(instance + "\n")

with open(os.path.expanduser("~/scan_hosts"), "w") as sh:
    for instance in b_instances_ips + w_instances_ips + consul_server_instances_ips + mysql_instances_ips:
        sh.write("ssh-keyscan -t rsa {} >> ~/.ssh/known_hosts\n".format(instance))

os.chmod(os.path.expanduser("~/scan_hosts"), 0o777)
