# Base stage for protocol buffer compilation
FROM node:20.11.1 AS proto-base

# Set the working directory in the container
WORKDIR /app

# Copy buffer configuration files to the working directory
COPY buf.* .

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install buf globally
RUN npm install -g @bufbuild/buf

# Copy the Protobuf definitions to the working directory
COPY protos ./protos

# Generate code from Protobuf definitions
RUN buf generate

#####################

# Build stage for the application
FROM node:20.11.1 AS build

# Set the working directory in the container
WORKDIR /app

# Install curl, a command line tool and library for transferring data with URLs
RUN apt-get update && apt-get install -y curl

# Copy the node_modules directory and compiled protobuf files from the proto-base stage
COPY --from=proto-base /app/node_modules ./node_modules
COPY --from=proto-base /app/pb ./pb
COPY . .
# Compile the application
RUN npm run build

# Download and install the gRPC health probe, used for checking the health of gRPC applications
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.13 && \
    curl -sLo /bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-arm64 && \
    chmod +x /bin/grpc_health_probe
#####################

# Final stage for running the application
FROM gcr.io/distroless/nodejs20-debian12

# Set the working directory in the container
WORKDIR /app

# Set the environment to production to optimize for production
ENV NODE_ENV production
ENV ENVIRONMENT production

# Copy compiled protobuf definitions to the container
COPY protos /app/dist/protos
COPY src/cert /app/dist/src/cert

# Copy the compiled application and its dependencies from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Copy the gRPC health probe to the container
COPY --from=build /bin/grpc_health_probe /bin/grpc_health_probe

# Command to run the application
CMD ["./dist/src/index.js"]
