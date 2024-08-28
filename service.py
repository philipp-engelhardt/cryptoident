from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route('/generate_wallet', methods=['GET'])
def generate_wallet():
    return jsonify(), 200


@app.route('/block/<int:block_height>', methods=['GET'])
def get_block_details(block_height):
    return jsonify(block_height), 200

@app.route('/latest_blocks', methods=['GET'])
def get_latest_blocks(block_height):
    return jsonify(block_height), 200


@app.route('/create_new_block', methods=['POST'])
def create_new_block():
    new_item = request.json
    return jsonify(new_item), 200


@app.route('/search', methods=['GET'])
def search_person():
    query = request.args.get('q', '').lower()
    return jsonify(query), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
