# Usa una imagen base con Node.js
FROM node:16

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de tu aplicación
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expón el puerto en el que tu aplicación se ejecuta
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]