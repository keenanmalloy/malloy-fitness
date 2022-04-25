FROM node:14.4.0-alpine3.11

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
ENV PORT 4000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["yarn", "run", "dev"]