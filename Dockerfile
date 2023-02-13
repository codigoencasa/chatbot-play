FROM node:18-bullseye as bot
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT

ARG VITE_URL

CMD ["npm", "run", "deploy"]