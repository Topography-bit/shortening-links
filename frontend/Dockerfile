FROM node:20-alpine AS build
WORKDIR /app
ENV NPM_CONFIG_PRODUCTION=false
ENV NODE_ENV=development
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --no-audit --no-fund --include=dev || npm install --no-audit --no-fund --include=dev

COPY src ./src
COPY index.html ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY vite.config.ts ./
COPY README.md ./

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
