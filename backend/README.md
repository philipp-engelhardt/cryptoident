# Start docker container with node
```
docker build -t cryptoident_node .
```
```
docker run cryptoident_node <initial_node_ip_adress>
```

# Create a new Wallet
```
wallet = Wallet()
wallet.generate_key_pair()
```

# Create a new Blockchain
```
blockchain = Blockchain()
blockchain.create_genesis_block(<genesis_public_key>, <genesis_private_key>):
```
Load and save a Blockchain from disk
```
blockchain.load_from_file()
blockchain.save_to_file()
```

# Create a new signed Block
```
block = Block(date.datetime.now(), (<person_id>, <privilege_level>), <person_public_key>, <validator_public_key>)
blockchain.add_block(block, wallet.private_key_pem)
```

# Create a new Node
```
local_host = Host(host_name=<host_ip_address>, port=5000)
initial_host = Host(host_name=<initial_host_ip_address>, port=5000)
node = Node(local_host, initial_host)
```