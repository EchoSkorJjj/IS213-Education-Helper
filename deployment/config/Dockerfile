FROM nginx:1.25.3-alpine3.18

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY certs/localhost.crt /etc/nginx/ssl/localhost.crt
COPY certs/localhost.key /etc/nginx/ssl/localhost.key
CMD [ "nginx", "-g", "daemon off;" ]