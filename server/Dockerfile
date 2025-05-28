FROM node:16-alpine
ENV NODE_ENV production

WORKDIR /app

# Copy package files first for better caching
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production

# Copy rest of the files
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
