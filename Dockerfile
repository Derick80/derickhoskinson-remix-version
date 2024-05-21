# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

# Set production environment
ENV NODE_ENV production

WORKDIR /app

# Setup production node_modules
FROM base as deps

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm install --production=false

FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm
COPY --from=deps /app/package.json /app/package.json
COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN touch ./app/refresh.ignored.js
RUN npm run build
# Finally, build the production image with minimal footprint
FROM base as run


#####################

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl node-gyp git python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]