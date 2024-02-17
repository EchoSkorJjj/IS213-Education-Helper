FROM kong:latest

USER root

RUN apt-get update && apt-get install -y lua5.4 lua5.4-dev luarocks

RUN luarocks install lua-resty-jwt
RUN luarocks install lua-cjson
RUN luarocks install lua-resty-http
RUN luarocks install lua-resty-cookie

USER kong
