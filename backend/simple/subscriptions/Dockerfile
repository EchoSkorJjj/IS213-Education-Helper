# TODO: Shift this to another dockerfile, then upload it to Dockerhub.
# This allows the base image with gcc and gRPC installed to be reused
# quickly by other developers.
FROM gcc:9.5.0 AS grpc-base
RUN apt-get update && apt-get install -y \
    build-essential autoconf libtool pkg-config cmake git
RUN git clone -b v1.62.0 https://github.com/grpc/grpc
WORKDIR /grpc
RUN git submodule update --init
RUN mkdir -p cmake/build
WORKDIR /grpc/cmake/build
RUN cmake ../..
RUN make
RUN make install

# Once grpc-base is pushed to Dockerhub, we have to change the base image
# to match the one we pushed. Else it will complain (because we removed it)
# or cause a rebuild for each developer, which takes forever...
FROM grpc-base AS builder
WORKDIR /app
COPY . .
RUN mkdir build && cd build && cmake .. && make

# Might want to find a lighter image to use as base here.
# Tried alpine, but it lacked the necessary libraries
# to run a binary executable. Temporarily using ubuntu,
# but definitely don't need everything in it...
FROM ubuntu:22.04
COPY --from=builder /app/build/SUBSCRIPTIONS_SERVICE /app/server
WORKDIR /app
CMD ["./server"]