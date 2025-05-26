# Use Node.js LTS version as base image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 5173 (Vite's default port)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
