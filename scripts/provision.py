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
P_INSTANCES_COUNT = 1
S_INSTANCES_COUNT = 1
I_INSTANCES_COUNT = 1
GALERA_INSTANCES_COUNT = 2
APPLIWEB_INSTANCES_COUNT = 1

subprocess.call(
    "openstack stack create -t {} {} "
    "--parameter b_instances_count={} "
    "--parameter w_instances_count={} "
    "--parameter p_instances_count={} "
    "--parameter s_instances_count={} "
    "--parameter i_instances_count={} "
    "--parameter galera_instances_count={} "
    "--parameter consul_server_instances_count={} "
    "--parameter appliWeb_instances_count={}"
        .format(
        HOT_PATH, STACK_NAME,
        B_INSTANCES_COUNT,
        W_INSTANCES_COUNT,
        P_INSTANCES_COUNT,
        S_INSTANCES_COUNT,
        I_INSTANCES_COUNT,
        GALERA_INSTANCES_COUNT,
        CONSUL_INSTANCES_COUNT,
        APPLIWEB_INSTANCES_COUNT),
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


# Create and associate a floating ip address to appliWeb instances

# def create_floating_ip():
#     floating_ip_state = json.loads(
#         subprocess.check_output("openstack floating ip create external-network -f json", shell=True).decode())
#     return floating_ip_state
#
#
# for app_instance_index in range(0, APPLIWEB_INSTANCES_COUNT):
#     current_floating_ip = create_floating_ip()
#     subprocess.check_output(
#         "openstack server add floating ip appliWeb_{} {}".format(app_instance_index,
#                                                                  current_floating_ip["floating_ip_address"]),
#         shell=True)

print("Stack creation successful.")

# Extract instances ips
galera_first_node_ip = list(
    map(lambda x: x["output_value"],
        filter(lambda x: x["output_key"] == "galera_first_node", stack_status["outputs"])))[0]
b_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "b", stack_status["outputs"])))[0]
w_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "w", stack_status["outputs"])))[0]
p_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "p", stack_status["outputs"])))[0]
s_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "s", stack_status["outputs"])))[0]
i_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "i", stack_status["outputs"])))[0]
galera_instances_ips = list(
    map(lambda x: x["output_value"],
        filter(lambda x: x["output_key"] == "galera_other_node", stack_status["outputs"])))[0]
consul_server_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "consul_server", stack_status["outputs"])))[0]
appliWeb_instances_ips = list(
    map(lambda x: x["output_value"], filter(lambda x: x["output_key"] == "appliWeb", stack_status["outputs"])))[0]

with open("/etc/ansible/hosts", "w") as hosts:
    hosts.write("[b]\n")
    for b in b_instances_ips:
        hosts.write(b + "\n")

    hosts.write("[w]\n")
    for w in w_instances_ips:
        hosts.write(w + "\n")

    hosts.write("[p]\n")
    for p in p_instances_ips:
        hosts.write(p + "\n")

    hosts.write("[s]\n")
    for s in s_instances_ips:
        hosts.write(s + "\n")

    hosts.write("[i]\n")
    for i in i_instances_ips:
        hosts.write(i + "\n")

    hosts.write("[consul_server]\n")
    for cs in consul_server_instances_ips:
        hosts.write(cs + "\n")

    hosts.write("[galera_all_nodes]\n")
    for gi in galera_instances_ips:
        hosts.write(gi + "\n")
    hosts.write(galera_first_node_ip + "\n")

    hosts.write("[galera_other_node]\n")
    for gi in galera_instances_ips:
        hosts.write(gi + "\n")

    hosts.write("[galera_first_node]\n")
    hosts.write(galera_first_node_ip + "\n")

    hosts.write("[appliWeb]\n")
    for aw in appliWeb_instances_ips:
        hosts.write(aw + "\n")

    hosts.write("[all_nodes]\n")
    for instance in b_instances_ips + w_instances_ips + consul_server_instances_ips \
            + appliWeb_instances_ips + p_instances_ips + s_instances_ips + i_instances_ips:
        hosts.write(instance + "\n")

with open(os.path.expanduser("~/scan_hosts"), "w") as sh:
    for instance in b_instances_ips + w_instances_ips + consul_server_instances_ips \
            + appliWeb_instances_ips + p_instances_ips + s_instances_ips + i_instances_ips + galera_instances_ips:
        sh.write("ssh-keyscan -t rsa {} >> ~/.ssh/known_hosts\n".format(instance))
    sh.write("ssh-keyscan -t rsa {} >> ~/.ssh/known_hosts\n".format(galera_first_node_ip))

os.chmod(os.path.expanduser("~/scan_hosts"), 0o777)
