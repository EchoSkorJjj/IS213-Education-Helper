FROM ruby:3.3.0-alpine as builder
RUN apk add --no-cache build-base nodejs npm
WORKDIR /app
COPY . .
RUN bundle install

FROM ruby:3.3.0-alpine
WORKDIR /app
RUN apk add --no-cache nodejs npm curl && \
    npm install -g localtunnel && \
    npm cache clean --force && \
    rm -rf /var/cache/apk/*
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=builder /app /app
CMD ["/bin/sh", "start_services.sh"]