FROM kong:3.1.1-alpine AS builder
USER root
RUN apk add --update lua5.4 lua5.4-dev luarocks build-base
RUN luarocks install lua-resty-jwt
RUN luarocks install lua-cjson
RUN luarocks install lua-resty-http
RUN luarocks install lua-resty-cookie

FROM kong:3.1.1-alpine
COPY --from=builder /usr/local/lib/luarocks/rocks-5.1/ /usr/local/lib/luarocks/rocks-5.1/
COPY --from=builder /usr/local/share/lua/5.1 /usr/local/share/lua/5.1
COPY certs /etc/kong/ssl
USER kong