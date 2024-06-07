FROM node:lts-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV production

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "deploy" ]
