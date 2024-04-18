# FROM kong:3.1.1-alpine AS builder
# USER root
# RUN apk add --update lua5.4 lua5.4-dev luarocks build-base
# RUN luarocks install lua-resty-jwt
# RUN luarocks install lua-cjson
# RUN luarocks install lua-resty-http
# RUN luarocks install lua-resty-cookie

# FROM kong:3.1.1-alpine
# COPY --from=builder /usr/local/lib/luarocks/rocks-5.1/ /usr/local/lib/luarocks/rocks-5.1/
# COPY --from=builder /usr/local/share/lua/5.1 /usr/local/share/lua/5.1
# COPY certs /etc/kong/ssl
# USER kong

# Use Kong's official Alpine image as the base
FROM kong:3.1.1-alpine AS builder

# Set up environment and install dependencies with LuaRocks
USER root
RUN apk add --update lua5.4 lua5.4-dev luarocks build-base
RUN luarocks install lua-resty-jwt
RUN luarocks install lua-cjson
RUN luarocks install lua-resty-http
RUN luarocks install lua-resty-cookie

# Use multi-stage builds to keep the image size down
FROM kong:3.1.1-alpine

# Copy Lua dependencies
COPY --from=builder /usr/local/lib/luarocks/rocks-5.1/ /usr/local/lib/luarocks/rocks-5.1/
COPY --from=builder /usr/local/share/lua/5.1 /usr/local/share/lua/5.1

# Copy your custom Kong declarative configuration file
COPY kong.yml /etc/kong/kong.yml

# Copy your custom plugins
COPY authn-kong /usr/local/share/lua/5.1/kong/plugins/authn-kong
COPY rawstring-adapter /usr/local/share/lua/5.1/kong/plugins/rawstring-adapter

# Copy your protobuf files
COPY protos /usr/local/share/lua/5.1/kong/protos

# Ensure Kong runs as the kong user
USER kong

# Expose necessary ports
EXPOSE 8000 8443 8001 8444
