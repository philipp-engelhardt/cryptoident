import zipfile
from io import BytesIO
from flask import Flask, jsonify, request, send_file
from crypto import Wallet
from blockchain import Blockchain
from flask_cors import CORS

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
    new_item = request.json
    return jsonify(new_item), 200


@app.route('/search', methods=['GET'])
def search_person():
    data = request.get_json()
    person_id = data.get('person_id')
    return jsonify(person_id), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
