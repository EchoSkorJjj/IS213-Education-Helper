#!/bin/bash

# Navigate to the directory containing the proto file
cd /app/protos

# Generate Python files from the .proto file
python -m grpc_tools.protoc -I. --python_out=/app --grpc_python_out=/app notes.proto

# Move generated Python files to the desired directory (if needed)
# In this case, files are already generated directly in the /app directory based on the protoc command above,
# so moving files is not necessary. This step is mentioned for clarity and future reference.

echo "Proto files have been processed and Python files are generated in /app directory."
