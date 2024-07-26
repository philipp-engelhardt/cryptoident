import hashlib
import crypto


class Block:
    def __init__(self, timestamp, data, person_public_key, validator_public_key):
        self.index = None
        self.previous_hash = None
        self.timestamp = timestamp
        self.data = data
        self.person_public_key = person_public_key
        self.validator_public_key = validator_public_key
        self.signature = None
        self.hash = None

    def calculate_hash(self):
        hash_string = (f"{self.index}{self.previous_hash}{self.timestamp}{self.data}"
                       f"{self.person_public_key}{self.validator_public_key}{self.signature}")
        return hashlib.sha256(hash_string.encode()).hexdigest()

    def sign_block(self, private_key):
        message = (f"{self.index}{self.previous_hash}{self.timestamp}{self.data}"
                   f"{self.person_public_key}{self.validator_public_key}").encode()
        self.signature = crypto.sign_message(private_key, message)

    def verify_signature(self):
        message = (f"{self.index}{self.previous_hash}{self.timestamp}{self.data}"
                   f"{self.person_public_key}{self.validator_public_key}").encode()
        return crypto.verify_signature(self.validator_public_key, self.signature, message)
