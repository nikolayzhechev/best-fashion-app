# syntax=docker/dockerfile:1

# Use the specified Node.js version
ARG NODE_VERSION=18.18.0
FROM node:${NODE_VERSION}-alpine

# Install necessary dependencies for Puppeteer
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/*

# Set environment variable to tell Puppeteer to use Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Use production node environment by default.
ENV NODE_ENV production

# Set the working directory in the container
WORKDIR /data-scraper/scraper

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./
# COPY /data-scraper/scraper/package*.json ./
COPY ./package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
RUN --mount=type=cache,target=/root/.npm npm install --omit=dev
# RUN --mount=type=cache,target=/root/.npm npm install --omit=dev --prefix ./data-scraper/scraper   < throws err no such file or directory

# Copy the application code to the container
COPY data-scraper/scraper .
#COPY . .

RUN npm install --only=dev

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD ["npm", "start"]
