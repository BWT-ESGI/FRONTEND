# Étape 1 : Build avec Node
FROM node:22 AS builder

# Créer le dossier de l'app
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./
RUN npm i --force

# Copier le reste du projet
COPY . .

# Construire l'app Vite
RUN npm run build

# Étape 2 : Serveur statique (nginx)
FROM nginx:alpine

# Copier le build dans nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la config nginx de base (optionnel)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
