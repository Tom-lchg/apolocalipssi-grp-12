# src/Dockerfile

# Étape de build
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY components.json ./
RUN npm run build

# Étape de déploiement avec serveur statique
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configuration nginx pour écouter sur le port 5173
RUN echo 'server { listen 5173; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]