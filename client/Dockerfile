FROM node:16-alpine AS builder
ENV NODE_ENV production

WORKDIR /app

# Copy package files
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production --legacy-peer-deps

# Copy rest of the files
COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
