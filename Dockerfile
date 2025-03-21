FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist /app
EXPOSE 5000
CMD ["serve", "-s", ".", "-l", "5000"]