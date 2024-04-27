FROM developwithzt/esd-buf-healthprobe-base:general-1.0 as proto-base
COPY buf.* .
COPY src/protos/ protos/
RUN buf generate

FROM python:3.11.7 as builder
WORKDIR /app
RUN pip install pyinstaller
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=proto-base /app/pb/ /app
ENV PYTHONPATH /app/:/app/pb/:$PYTHONPATH
COPY src/ /app/
RUN pyinstaller --onefile server.py

FROM debian:stable-slim
WORKDIR /app
RUN apt-get update && \
    apt-get install -y \
    ocrmypdf \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/dist/server server
CMD ["./server"]
