# Stage 1: Build the Vite + React application
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack for modern package managers if needed (optional, keeping npm for simplicity)
RUN corepack enable npm

# Copy package configurations
COPY package.json package-lock.json* ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (standard container serving port)
EXPOSE 80

# Fallback configuration for SPA routing inside docker (if needed)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
