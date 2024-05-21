# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project files into the container
COPY . .

# Make your app's port available to the world outside
EXPOSE 3000

# Use the .env file or set environment variables
# COPY .env . (optional, use Docker -e flag instead for sensitive data)

# Command to run your app
CMD ["node", "server.js"]
