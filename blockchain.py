import pickle
import datetime as date
from pickle import FALSE

from block import Block


class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def save_to_file(self):
        with open('chain.pkl', 'wb') as file:
            pickle.dump(self.chain, file)

    def load_from_file(self):
        with open('chain.pkl', 'rb') as file:
            self.chain = pickle.load(file)

    @staticmethod
    def create_genesis_block():
        return Block(0, date.datetime.now(), "Genesis Block", "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, new_block):
        new_block.previous_hash = self.get_latest_block().hash
        new_block.hash = new_block.calculate_hash()
        self.chain.append(new_block)

    def is_valid(self):
        valid_public_keys = set()
        # add genesis public key
        valid_public_keys.add(self.chain[0].person_public_key)

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