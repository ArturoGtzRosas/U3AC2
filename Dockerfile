# Use the official Node.js image (Alpine version is lighter/faster)
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first (to cache dependencies)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (Documentation only)
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]