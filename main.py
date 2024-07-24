import datetime as date
from block import Block
from blockchain import Blockchain
from crypto import Crypto
from node import Node

# Create the blockchain
blockchain = Blockchain()

# Add blocks to the blockchain
blockchain.add_block(Block(1, date.datetime.now(), "Transaction Data 1", ""))
blockchain.add_block(Block(2, date.datetime.now(), "Transaction Data 2", ""))
blockchain.add_block(Block(3, date.datetime.now(), "Transaction Data 3", ""))

node1 = Node('localhost', 8776)
node1.start_server()

# Node 2
node2 = Node('localhost', 6778)
node2.start_server()
node2.connect_to_peer('localhost', 8776)
node2.register_all_peers()

# Broadcast a transaction from node 2
#transaction = {'from': 'Alice', 'to': 'Bob', 'amount': 10}
#node2.broadcast_blockchain(blockchain.chain)



# Print the contents of the blockchain
for block in blockchain.chain:
    print("Block #" + str(block.index))
    print("Timestamp: " + str(block.timestamp))
    print("Data: " + block.data)
    print("Hash: " + block.hash)
    print("Previous Hash: " + block.previous_hash)
    print("\n")