# Use an official Python runtime as a parent image
FROM python:3.9-slim
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

RUN pip install grpcio grpcio-tools protobuf
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src /app
COPY process_proto.sh /app/
RUN chmod +x /app/process_proto.sh

RUN /app/process_proto.sh


CMD ["python3", "-m", "main"]
# CMD ["sh", "-c", "while true; do sleep 60; done"]
