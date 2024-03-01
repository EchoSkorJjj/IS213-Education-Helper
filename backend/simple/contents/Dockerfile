FROM ubuntu:22.04 as pb-base
RUN apt-get update && apt-get install -y curl
RUN BIN="/usr/local/bin" && \
    VERSION="1.29.0" && \
    curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m)" \
    -o "${BIN}/buf" && \
    chmod +x "${BIN}/buf"
WORKDIR /app
COPY protos/ protos/
COPY buf.* .
RUN buf generate

FROM python:3.11.7-slim-bullseye
WORKDIR /app
ENV PYTHONPATH /app/:/app/pb/:$PYTHONPATH
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ src/
COPY --from=pb-base /app/pb/ /app/pb/
CMD ["python3", "src/main.py"]