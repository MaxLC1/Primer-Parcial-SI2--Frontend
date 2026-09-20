FROM nginx:alpine
# Copiamos la salida generada localmente a nginx
COPY dist/frontend-angular-ar/browser /usr/share/nginx/html
# Copiamos nuestra configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
