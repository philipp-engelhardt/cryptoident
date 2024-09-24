import pickle
import datetime as date
from block import Block


class Blockchain:
    def __init__(self, chain=None):
        self.chain = chain
        if chain is None:
            self.chain = []

    def save_to_file(self):
        with open('chain.pkl', 'wb') as file:
            pickle.dump(self.chain, file)

    def load_from_file(self):
        try:
            with open('chain.pkl', 'rb') as file:
                self.chain = pickle.load(file)
        except FileNotFoundError:
            self.chain = []

    def create_genesis_block(self, genesis_public_key, genesis_private_key):
        block = Block(date.datetime.now(), "Genesis Block", genesis_public_key, genesis_public_key)
        block.index = 0
        block.sign_block(genesis_private_key)
        block.hash = block.calculate_hash()
        self.chain = [block]

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def get_length(self):
        return len(self.chain)

    def add_block(self, new_block, private_key):
        new_block.index = self.get_latest_block().index + 1
        new_block.previous_hash = self.get_latest_block().hash
        new_block.sign_block(private_key)
        new_block.hash = new_block.calculate_hash()
        self.chain.append(new_block)

    def is_valid(self) -> bool:
        valid_public_keys = set()
        # add genesis public key
        valid_public_keys.add(self.chain[0].person_public_key)
        # verify genesis block
        if not self.is_genesis_block_valid():
            return False

        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if current_block.hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.hash:
                return False

            if not current_block.verify_signature():
                return False

            if current_block.validator_public_key not in valid_public_keys:
                return False

            valid_public_keys.add(current_block.person_public_key)

        return True

    def is_genesis_block_valid(self):
        genesis_block = self.chain[0]

        if genesis_block.hash != genesis_block.calculate_hash():
            return False

        if not genesis_block.verify_signature():
            return False

        if genesis_block.person_public_key != genesis_block.validator_public_key:
            return False

        return True
