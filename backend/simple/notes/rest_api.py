from flask import Flask, request, jsonify
import grpc
import notes_pb2
import notes_pb2_grpc

app = Flask(__name__)

# Assume this is the address of your gRPC server
GRPC_SERVER_ADDRESS = 'localhost:50052'

@app.route('/upload_note', methods=['POST'])
def upload_note():
    # This route expects a multipart/form-data request
    # with 'userId', 'filename', and 'fileContent' fields
    if 'fileContent' not in request.files:
        return jsonify({"error": "fileContent part is missing"}), 400
    file_content = request.files['fileContent']
    user_id = request.form.get('userId')
    filename = request.form.get('filename')

    # Connect to gRPC server
    channel = grpc.insecure_channel(GRPC_SERVER_ADDRESS)
    stub = notes_pb2_grpc.NoteServiceStub(channel)

    # Prepare the request for gRPC
    grpc_request = notes_pb2.UploadNoteRequest(
        userId=user_id,
        filename=filename,
        fileContent=file_content.read()
    )

    # Call the gRPC service
    try:
        response = stub.UploadNote(grpc_request)
        return jsonify({"noteId": response.noteId}), 200
    except grpc.RpcError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
