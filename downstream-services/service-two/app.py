from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/two/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Pong! from service two"}), 200

@app.route('/two/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({"received at service two": data}), 200

if __name__ == '__main__':
    app.run(host="service-two", debug=True, port=80)
