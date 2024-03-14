FROM ubuntu:22.04 as proto-base
WORKDIR /app
RUN apt-get update && apt-get install -y \
curl wget
RUN BIN="/usr/local/bin" && \
    VERSION="1.29.0" && \
    curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m)" \
    -o "${BIN}/buf" && \
    chmod +x "${BIN}/buf"
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.13 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe
COPY protos/ protos/
COPY buf.* .
RUN buf generate

FROM ruby:3.3.0-alpine as builder
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN apk add --update --no-cache build-base && bundle install

FROM ruby:3.3.0-alpine
WORKDIR /app
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/ /app/
COPY --from=proto-base /app/pb/ /app/pb/
COPY src/ src/
CMD ["ruby", "src/server.rb"]
