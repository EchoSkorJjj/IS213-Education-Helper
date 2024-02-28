# Start with a Python slim base image
FROM python:3.9-slim

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set timezone (required for some configurations)
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install OCRmyPDF, Tesseract OCR, Protocol Buffers Compiler, and other dependencies
RUN apt-get update && \
    apt-get install -y \
    ocrmypdf \
    tesseract-ocr \
    tesseract-ocr-eng \
    libsm6 \
    libxext6 \
    libxrender-dev \
    poppler-utils \
    ghostscript \
    qpdf \
    protobuf-compiler \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install gRPC tools for Python
RUN pip install grpcio grpcio-tools protobuf


# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the proto files and application files into the container
COPY ./src /app

# Compile the proto files to generate Python code
RUN python -m grpc_tools.protoc -I/app --python_out=/app --grpc_python_out=/app /app/file_processor.proto

# Set the default command to run the app
CMD ["python3", "-m", "service"]
