FROM ruby:3.3.0
RUN apt-get update -qq && apt-get install -y nodejs npm
RUN npm install -g localtunnel

WORKDIR /app
ADD . /app
RUN bundle install
EXPOSE 4567

COPY start_services.sh /start_services.sh
RUN chmod +x /start_services.sh
CMD ["/start_services.sh"]