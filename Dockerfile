# Build image
FROM node:14 as builder

RUN apk add --no-cache git python make gcc g++

WORKDIR /app

ADD package.json ./
ADD package-lock.json ./
RUN npm install

ADD . ./
ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN npm run build


# Target image
FROM node:14
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

ADD package.json ./

COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/

EXPOSE 3030
CMD [ "node", "dist/main.js" ]