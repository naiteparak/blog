FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install
CMD ["npm", "run", "start:dev"]