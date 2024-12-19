FROM node:18-slim as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN apt-get update && apt-get install -y --no-install-recommends make g++ \
    && yarn install --frozen-lockfile \
    && apt-get remove -y make g++ \
    && apt-get autoremove -y \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY . ./
RUN yarn build

FROM node:18-slim as runner
WORKDIR /app
# Copy only the built artifact and necessary files, not node_modules.
COPY --from=builder /app/dist ./dist
COPY package.json yarn.lock ./
# For production, you'd typically install only production deps:
RUN yarn install --frozen-lockfile --production \
    && yarn cache clean \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 5173
CMD ["yarn", "run", "dev"]
