FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

EXPOSE 80

CMD ["sh", "-c", "npm run build && npm run preview -- --port 80"]
