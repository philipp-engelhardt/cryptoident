# Create a new Wallet
```
wallet = Wallet()
wallet.generate_key_pair()
```

# Create a new Blockchain
```
blockchain = Blockchain(wallet.public_key_pem, wallet.private_key_pem)
```

# Create a new signed Block
```
block = Block(date.datetime.now(), ("56c9ac4d6090de", 1), "", wallet.public_key_pem)
blockchain.add_block(block, wallet.private_key_pem)
```
