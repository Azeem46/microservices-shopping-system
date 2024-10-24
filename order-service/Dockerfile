# Use Node.js as the base image
FROM node:18

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy wait script
COPY wait-for-rabbitmq.sh ./
RUN chmod +x wait-for-rabbitmq.sh

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3002 
EXPOSE 3003  

# Start the application using the wait script
CMD ["./wait-for-rabbitmq.sh", "node", "index.js"]
