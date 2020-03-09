FROM node:lts-alpine as build

WORKDIR /app
COPY ./package.json ./dist/bin/* ./
RUN npm install --production

FROM node:lts-alpine
COPY --from=build /app /app
EXPOSE 8080

CMD ["node", "--experimental-modules", "/app/index.js"]