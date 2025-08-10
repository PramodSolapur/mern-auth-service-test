# Official node image as base image
FROM node:18-alpine

# Create working dir inside a container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json file to leverage docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps


# Copy rest of the source code
COPY . .

# Expose app port
EXPOSE 5501

# Command to run 
CMD [ "npm", "run", "dev" ]