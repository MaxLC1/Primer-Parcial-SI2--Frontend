# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Nginx para servir los archivos
FROM nginx:alpine
# Copiamos la salida de la etapa de construcción de Angular a la carpeta web de nginx
COPY --from=build /app/dist/frontend-angular-ar/browser /usr/share/nginx/html
# Copiamos nuestra configuración de nginx para que las rutas funcionen
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
