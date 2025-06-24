# Dockerfile para el frontend Next.js en modo desarrollo
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set NODE_ENV to development
ENV NODE_ENV=development

# Run in development mode with host binding
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
