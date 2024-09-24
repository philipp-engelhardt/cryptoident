import threading
import zipfile
import datetime as date
from io import BytesIO
from typing import Optional

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.serving import make_server

from block import Block
from crypto import Wallet
from blockchain import Blockchain
from node import Node

app = Flask(__name__)
CORS(app)

API_PORT = 4000  # Port for service api

global node  # Reference to node object
node: Optional[Node] = None


@app.route('/generate_wallet', methods=['GET'])
def generate_wallet():
    wallet = Wallet()
    wallet.generate_key_pair()
    zip_buffer = BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        zip_file.writestr('private.pem', wallet.private_key_pem)
        zip_file.writestr('public.pem', wallet.public_key_pem)

    zip_buffer.seek(0)

    return send_file(
        zip_buffer,
        mimetype='application/zip',
        as_attachment=True,
        download_name='keys.zip'
    ), 200


@app.route('/block/<int:block_height>', methods=['GET'])
def get_block_details(block_height):
    blockchain = Blockchain()
    blockchain.load_from_file()
    block = blockchain.chain[block_height]
    return jsonify(block.to_dict()), 200


@app.route('/latest_blocks', methods=['GET'])
def get_latest_blocks():
    blockchain = Blockchain()
    blockchain.load_from_file()
    # get the last 6 blocks
    latest_blocks = blockchain.chain[-6:]
    result = []
    for block in latest_blocks:
        result.append(block.to_dict())
    return jsonify(result), 200


@app.route('/create_new_block', methods=['POST'])
def create_new_block():
    files = request.files
    attribs = request.values
    streams = {}

    for key in files:
        streams[key] = files[key].read()

    blockchain = Blockchain()
    blockchain.load_from_file()
    block = Block(date.datetime.now(), (attribs['person_id'], attribs['privilege_level']), streams['person'],
                  streams['public'])
    blockchain.add_block(block, streams['private'])

    if blockchain.is_valid():
        blockchain.save_to_file()
        # spread the new block on the network
        node.broadcast_new_block(block)
        return jsonify(blockchain.get_latest_block().to_dict()), 200
    else:
        return jsonify('The blockchain is not valid with the new block!'), 400


@app.route('/create_genesis_block', methods=['POST'])
def create_genesis_block():
    files = request.files
    streams = {}

    for key in files:
        streams[key] = files[key].read()

    blockchain = Blockchain()
    blockchain.create_genesis_block(streams['public'], streams['private'])

    if blockchain.is_valid():
        blockchain.save_to_file()
        return jsonify(blockchain.get_latest_block().to_dict()), 200
    else:
        return jsonify('The blockchain is not valid!'), 400


@app.route('/search', methods=['POST'])
def search_person():
    data = request.get_json()
    person_id = data.get('person_id')
    blockchain = Blockchain()
    blockchain.load_from_file()
    for block in blockchain.chain:
        block_data = block.data
        if block_data[0] == person_id:
            block_latest_data = block
    if block_latest_data is not None:
        return jsonify(block_latest_data.to_dict()), 200
    else:
        return jsonify('Person not found!'), 404


@app.route('/services', methods=['GET'])
def get_services():
    return jsonify(list(node.known_services)), 200

class ServerThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.srv = make_server('0.0.0.0', API_PORT, app)
        self.ctx = app.app_context()
        self.ctx.push()

    def run(self):
        self.srv.serve_forever()

    def shutdown(self):
        self.srv.shutdown()


def start_api_service(rpc_node):
    server_thread = ServerThread()
    server_thread.start()
    global node
    node = rpc_node
    return server_thread
