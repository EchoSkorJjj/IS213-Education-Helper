FROM developwithzt/esd-cpp-grpc-base:1.0 AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libpqxx-dev \
    libpq-dev \
    curl
RUN BIN="/usr/local/bin" && \
    VERSION="1.29.0" && \
    curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m)" \
    -o "${BIN}/buf" && \
    chmod +x "${BIN}/buf"
COPY . .
RUN buf generate
RUN mkdir build && cd build && cmake .. && make

# Might want to find a lighter image to use as base here.
# Tried alpine, but it lacked the necessary libraries
# to run a binary executable. Temporarily using ubuntu,
# but definitely don't need everything in it...
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    libpqxx-6.4 \
    libpq5
COPY --from=builder /app/build/SUBSCRIPTIONS_SERVICE /app/server
WORKDIR /app
COPY .env .
CMD ["./server"]
