# Etapa de construcción
FROM node:18-alpine AS builder

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y compilar
COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar configuración de dependencias y solo instalar producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar build desde la etapa anterior
COPY --from=builder /usr/src/app/dist ./dist

# Puerto que expone la aplicación de NestJS
EXPOSE 3000

# Levantar servidor
CMD ["node", "dist/main"]
