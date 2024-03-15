FROM ubuntu:22.04 as proto-base
RUN apt-get update && apt-get install -y curl wget
RUN BIN="/usr/local/bin" && \
    VERSION="1.29.0" && \
    curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m)" \
    -o "${BIN}/buf" && \
    chmod +x "${BIN}/buf"
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.13 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe
WORKDIR /app
COPY protos/ protos/
COPY buf.* .
RUN buf generate

FROM python:3.11.7-slim-bullseye
WORKDIR /app
COPY --from=proto-base /app/pb/ /app/pb/
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
ENV PYTHONPATH /app/:/app/pb/:$PYTHONPATH
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ src/
CMD ["python3", "src/main.py"]