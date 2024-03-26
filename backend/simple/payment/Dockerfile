FROM developwithzt/esd-buf-healthprobe-base:general-1.0 as proto-base
COPY buf.* .
COPY protos/ protos/
RUN buf generate

FROM ruby:3.3.0-slim as builder
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf /usr/local/bundle/cache/*.gem && \
    find /usr/local/bundle/gems/ -name "*.c" -delete && \
    find /usr/local/bundle/gems/ -name "*.o" -delete

FROM ruby:3.3.0-slim
WORKDIR /app
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=builder /app/Gemfile* /app/Gemfile*
COPY --from=proto-base /bin/grpc_health_probe /bin/grpc_health_probe
COPY --from=proto-base /app/pb/ /app/pb/
COPY src/ src/
CMD ["ruby", "src/server.rb"]
