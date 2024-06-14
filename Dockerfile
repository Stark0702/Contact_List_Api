# Use an official Node.js image as a base
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
