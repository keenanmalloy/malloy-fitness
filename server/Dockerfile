FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ENV PORT 4000

ENV PGOPTIONS "-c search_path=auth"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY --from=builder /app/dist/ dist/

HEALTHCHECK --interval=60s --timeout=2s --retries=3 CMD wget localhost:${PORT}/health -q -O - > /dev/null 2>&1

EXPOSE $PORT
CMD ["npm", "run", "start"]