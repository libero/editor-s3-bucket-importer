FROM node:lts-alpine as build

WORKDIR /app
COPY ./package.json ./dist/bin/* ./
RUN npm install --production

FROM node:lts-alpine
COPY --from=build /app /
EXPOSE 8080

CMD ["node", "index.js"]