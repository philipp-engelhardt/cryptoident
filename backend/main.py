import socket
import logging
import sys

import crypto
from node import Node
import service


logger = logging.getLogger('kademlia')
logger.setLevel(logging.DEBUG)  # Log Level: DEBUG, INFO, WARNING, ERROR, CRITICAL
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
logger.warning("IP Address: " + ip_address)

threads = []

if len(sys.argv) > 1:
    node = Node(logger, ip_address, sys.argv[1], len(sys.argv) > 2)
    logger.warning("Started Node with " + sys.argv[1])
else:
    node = Node(logger, ip_address)
    logger.warning("Starting network ... ")

threads.append(node.server_thread)
threads.append(node.maintain_peers_thread)

if len(sys.argv) > 2:
    threads.append(service.start_api_service(node))
    logger.warning("Started api service")
    logger.warning("Serving as node with backend...")
else:
    logger.warning("Serving as normal node...")

# Wait until all threads are completed
for t in threads:
    t.join()
