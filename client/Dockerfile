# Stage 1: Build the application
FROM node:latest AS builder
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application, output goes to dev-dist
RUN npm run build

# Stage 2: Setup the production environment with Nginx
FROM nginx:latest

# Copy the built files from the builder stage to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx","-g","daemon off;"]