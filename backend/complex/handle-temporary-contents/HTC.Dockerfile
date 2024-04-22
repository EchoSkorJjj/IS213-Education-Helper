FROM developwithzt/esd-buf-healthprobe-base:go-1.0 as proto-base
COPY buf.* .
COPY api/ api/
RUN buf generate

FROM golang:alpine3.19 AS builder
WORKDIR /app

# Install curl to fetch grpc_health_probe
RUN apk --no-cache add curl

COPY go.mod go.sum ./
RUN go mod download
COPY --from=proto-base /app/pb/ pb/
COPY cmd/ cmd/
COPY internal/ internal/
RUN go build -o /app/build/server cmd/main.go

# Download and install the gRPC health probe
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.13 && \
    curl -sLo /app/build/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-arm64 && \
    chmod +x /app/build/grpc_health_probe

FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=builder /app/build/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/build/server .
CMD ["./server"]
