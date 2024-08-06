import pickle

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization


class Wallet:
    def __init__(self):
        self.public_key_pem = None
        self.private_key_pem = None

    def generate_key_pair(self):
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )

        public_key = private_key.public_key()

        self.public_key_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        self.private_key_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

    def save_key_pair_to_file(self):
        with open('private.pem', 'wb') as file:
            pickle.dump(self.private_key_pem, file)

        with open('public.pem', 'wb') as file:
            pickle.dump(self.public_key_pem, file)

    def load_key_pair_from_file(self):
        with open('private.pem', 'rb') as file:
            self.private_key_pem = pickle.load(file)

        with open('public.pem', 'rb') as file:
            self.public_key_pem = pickle.load(file)


def sign_message(private_key_pem, message):
    private_key = serialization.load_pem_private_key(
        private_key_pem,
        password=None,
        backend=default_backend()
    )

    return private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )


def verify_signature(public_key_pem, signature, message):
    public_key = serialization.load_pem_public_key(
        public_key_pem,
        backend=default_backend()
    )
    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except Exception:
        return False
