FROM developwithzt/esd-buf-healthprobe-base:go-1.0 as proto-base
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