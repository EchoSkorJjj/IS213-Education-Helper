FROM ruby:3.3.0-alpine as builder
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install

FROM ruby:3.3.0-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=builder /app/ /app/
COPY stripe_service.rb .
CMD ["ruby", "stripe_service.rb"]