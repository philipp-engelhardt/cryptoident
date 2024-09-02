import zipfile
import datetime as date
from io import BytesIO
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import main

from block import Block
from crypto import Wallet
from blockchain import Blockchain

app = Flask(__name__)
CORS(app)


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
    block = Block(date.datetime.now(), (attribs['person_id'], attribs['privilege_level']), streams['person'], streams['public'])
    blockchain.add_block(block, streams['private'])
    blockchain.save_to_file()

    return jsonify(blockchain.get_latest_block().to_dict()), 200


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
        return jsonify('Person not found!'), 402


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=4000)
    main.create_blocks()
    
