import datetime as date
import sys
import time

from block import Block
from blockchain import Blockchain
from crypto import Wallet
from node import Node
from node import Host
import socket


wallet = Wallet()
wallet.generate_key_pair()

blockchain = Blockchain()
blockchain.create_genesis_block(wallet.public_key_pem, wallet.private_key_pem)
block = Block(date.datetime.now(), ("56c9ac4d6090de", 1), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)

block = Block(date.datetime.now(), ("56c9acak60sdkk", 5), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)

block = Block(date.datetime.now(), ("57c9acak60sdkk", 5), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)

block = Block(date.datetime.now(), ("54c9acak60sdkk", 10), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)

block = Block(date.datetime.now(), ("53c9acak60sdkk", 10), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)

blockchain.save_to_file()
blockchain.is_valid()


hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)
print("IP Address:", ip_address)

local = Host(host_name='192.168.0.221', port=5000)

#if len(sys.argv) > 1:
#    start = Host(host_name=sys.argv[1], port=5000)
#    node = Node(local, start)
#else:
#    node = Node(local)


if len(sys.argv) > 2:
    block = Block(date.datetime.now(), ("qeweqeqw", 1), "", wallet.public_key_pem)
    blockchain.add_block(block, wallet.private_key_pem)
    blockchain.is_valid()

#third = Host(host_name='localhost', port=8003)

# Node 2
#node3 = Node(third, first)

# Broadcast a transaction from node 2
#transaction = {'from': 'Alice', 'to': 'Bob', 'amount': 10}
#node2.broadcast_blockchain(blockchain.chain)

#blockchain.load_from_file()

# Print the contents of the blockchain
for block in blockchain.chain:
    print(f"Block #: {block.index}")
    print(f"previous_hash: {block.previous_hash}")
    print(f"timestamp: {block.timestamp}")
    print(f"data: {block.data}")
    print(f"person_public_key: {block.person_public_key}")
    print(f"validator_public_key: {block.validator_public_key}")
    print(f"signature: {block.signature}")
    print(f"hash: {block.hash}")
    print("\n")

time.sleep(9999)  # Check every second
