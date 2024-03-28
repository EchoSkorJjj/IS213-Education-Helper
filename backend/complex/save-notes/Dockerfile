FROM developwithzt/esd-buf-healthprobe-base:general-1.0 as proto-base
COPY buf.* .
COPY protos/ protos/
RUN buf generate

FROM python:3.11.7 as builder
WORKDIR /app
RUN pip install pyinstaller
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=proto-base /app/pb/ /app/pb/
ENV PYTHONPATH /app/:/app/pb/:$PYTHONPATH
COPY src/ src/
RUN pyinstaller --onefile src/main.py

FROM debian:stable-slim
WORKDIR /app
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/dist/main server
CMD ["./server"]
