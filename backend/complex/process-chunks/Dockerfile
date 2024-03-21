# Start with a Python slim base image
FROM python:3.11-slim

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set timezone (required for some configurations)
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install OCRmyPDF, Tesseract OCR, Protocol Buffers Compiler, and other dependencies
RUN apt-get update && \
    apt-get install -y \
    libpq-dev \
    gcc\
    python3-dev\
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade setuptools pip


# Install gRPC tools for Python
# RUN pip install grpcio grpcio-tools protobuf Faker

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application files and scripts into the container
COPY ./src /app


# Set the default command to run the app
CMD ["python3", "-m", "main.py"]
# ENTRYPOINT ["sh", "-c", "echo $JAVA_HOME && while true; do sleep 1; done"]
