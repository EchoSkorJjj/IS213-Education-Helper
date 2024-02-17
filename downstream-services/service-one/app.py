from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/one/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Pong! from service one"}), 200

@app.route('/one/pong', methods=['GET'])
def pong():
    return jsonify({"message": "Ping! from service one"}), 200

@app.route('/one/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({"received at service one": data}), 200

if __name__ == '__main__':
    app.run(host='service-one', debug=True, port=80)
