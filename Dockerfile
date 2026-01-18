# virtual-lab-frontend/Dockerfile

# 1-кезең: Жинау (Build)
FROM node:20-alpine as build

WORKDIR /app

# package.json файлдарын көшіру
COPY package.json package-lock.json ./

# Тәуелділіктерді орнату
RUN npm ci

# Барлық кодты көшіру және build жасау
COPY . .
RUN npm run build

# 2-кезең: Nginx арқылы тарату (Serve)
FROM nginx:alpine

# Жинақталған файлдарды (dist папкасын) Nginx-ке көшіру
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx конфигурациясын көшіру
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]