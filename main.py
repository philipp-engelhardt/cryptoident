import datetime as date
from block import Block
from blockchain import Blockchain
from crypto import Wallet
from node import Node


wallet = Wallet()
wallet.generate_key_pair()

blockchain = Blockchain(wallet.public_key_pem, wallet.private_key_pem)
block = Block(date.datetime.now(), ("56c9ac4d6090de", 1), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)

blockchain.is_valid()

#node1 = Node('localhost', 8776)
#node1.start_server()

# Node 2
#node2 = Node('localhost', 6778)
#node2.start_server()
#node2.connect_to_peer('localhost', 8776)
#node2.register_all_peers()

# Broadcast a transaction from node 2
#transaction = {'from': 'Alice', 'to': 'Bob', 'amount': 10}
#node2.broadcast_blockchain(blockchain.chain)


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
