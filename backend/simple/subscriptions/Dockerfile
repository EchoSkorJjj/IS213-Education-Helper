FROM developwithzt/esd-buf-healthprobe-base:general-1.0 as proto-base
COPY buf.* .
COPY protos/ protos/
RUN buf generate

FROM developwithzt/esd-cpp-grpc-base:multi-platform AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libpqxx-dev \
    libpq-dev
COPY CMakeLists.txt .
COPY include/ include/
COPY src/ src/
COPY --from=proto-base /app/pb/ /app/pb/
RUN mkdir build && cd build && cmake .. && make

FROM ubuntu:22.04
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libpqxx-6.4 \
    libpq5
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/build/SUBSCRIPTIONS_SERVICE /app/server
CMD ["./server"]
