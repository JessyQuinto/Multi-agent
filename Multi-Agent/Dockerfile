# ================================
# Build stage – Compile Vite app
# ================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies using clean CI install
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the project (Vite outputs to /dist)
RUN npm run build


# ======================================
# Runtime stage – Serve with NGINX
# ======================================
FROM nginx:1.25-alpine

# Copy build output from Vite
COPY --from=builder /app/dist/ /var/www/

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start NGINX
ENTRYPOINT ["nginx", "-g", "daemon off;"]

#docker build -t desk-agent-app .
#docker run -p 8080:80 desk-agent-app

