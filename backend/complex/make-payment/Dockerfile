FROM golang:alpine3.19 AS proto-base
WORKDIR /app
RUN go install github.com/bufbuild/buf/cmd/buf@v1.29.0 \
    && go install google.golang.org/protobuf/cmd/protoc-gen-go@latest \
    && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.13 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe
COPY buf.* .
COPY api/ api/
RUN buf generate

FROM golang:alpine3.19 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY --from=proto-base /app/pb/ pb/
COPY cmd/ cmd/
COPY internal/ internal/
RUN go build -o /app/build/server cmd/main.go

FROM alpine:3.19.1
WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=builder /app/build/server .
CMD ["./server"]