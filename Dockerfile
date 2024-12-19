FROM node:18-slim as base

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --froze-lockfile
COPY . ./
# RUN yarn build
EXPOSE 5173 

CMD ["yarn", "run", "dev"]