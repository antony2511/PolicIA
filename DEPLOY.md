# 🚀 Guía de Deploy - PolicIA

Esta guía explica cómo desplegar PolicIA en un servidor con Docker Compose.

## 📋 Requisitos Previos

- Servidor Linux (Ubuntu 20.04+ recomendado)
- Docker instalado
- Docker Compose instalado
- Puertos disponibles: 3000, 3001, 8000
- Git instalado

## 🔧 Preparación

### 1. Clonar/Subir el Proyecto

```bash
# Opción A: Clonar desde repositorio
git clone <tu-repositorio> policia-ai
cd policia-ai

# Opción B: Subir archivos con SCP
scp -r policia-ai/ usuario@servidor:/home/usuario/
ssh usuario@servidor
cd policia-ai
```

### 2. Configurar Variables de Entorno

```bash
cd backend
cp .env.example .env
nano .env
```

Completar con tus credenciales reales:

```env
# Firebase Admin SDK (desde Firebase Console)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-project.iam.gserviceaccount.com

# OpenAI API
OPENAI_API_KEY=sk-proj-tu-api-key

# ChromaDB
CHROMA_HOST=http://chromadb:8000
CHROMA_COLLECTION=legislacion_colombiana

# Server
PORT=3001
NODE_ENV=production
```

### 3. Configurar Firebase en Frontend

```bash
cd ..
nano .env.local
```

Agregar credenciales de Firebase (web):

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 🐳 Despliegue con Docker Compose

### 1. Construir y Levantar Servicios

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f chromadb
```

### 2. Verificar que los Servicios Estén Corriendo

```bash
# Ver contenedores activos
docker-compose ps

# Debería mostrar:
# policia-backend     running   0.0.0.0:3001->3001/tcp
# policia-chromadb    running   0.0.0.0:8000->8000/tcp
# policia-frontend    running   0.0.0.0:3000->3000/tcp
```

### 3. Verificar Conectividad

```bash
# ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Backend API
curl http://localhost:3001/health

# Frontend (en navegador)
# http://servidor-ip:3000
```

## 📚 Ingestar Legislación

Una vez que ChromaDB esté corriendo:

```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Ejecutar script de ingesta
npm run ingest

# Salir del contenedor
exit
```

El proceso de ingesta puede tardar 10-15 minutos. Verás el progreso en la consola.

## 🔄 Comandos Útiles

### Detener Servicios
```bash
docker-compose down
```

### Reiniciar un Servicio
```bash
docker-compose restart backend
docker-compose restart chromadb
```

### Ver Logs en Tiempo Real
```bash
docker-compose logs -f --tail=100
```

### Reconstruir Después de Cambios
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Eliminar Volúmenes (CUIDADO: Borra ChromaDB)
```bash
docker-compose down -v
```

### Ejecutar Comandos en Contenedor
```bash
# Backend
docker-compose exec backend npm run ingest

# Ver archivos en backend
docker-compose exec backend ls -la
```

## 🌐 Configuración de Nginx (Producción)

Si quieres usar un dominio y HTTPS:

```nginx
# /etc/nginx/sites-available/policia-ai

server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

Luego:
```bash
sudo ln -s /etc/nginx/sites-available/policia-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Instalar SSL con Certbot
sudo certbot --nginx -d tu-dominio.com
```

## 🔍 Troubleshooting

### ChromaDB no inicia
```bash
# Ver logs detallados
docker-compose logs chromadb

# Verificar puertos
netstat -tulpn | grep 8000
```

### Backend no se conecta a ChromaDB
```bash
# Verificar que estén en la misma red
docker network ls
docker network inspect policia-ai_default

# Probar conectividad desde backend
docker-compose exec backend ping chromadb
```

### Error de permisos en volúmenes
```bash
sudo chown -R 1000:1000 backend/data
```

### Frontend no carga
```bash
# Verificar variables de entorno
docker-compose exec frontend env | grep VITE

# Reconstruir
docker-compose restart frontend
```

## 📊 Monitoreo

### Ver uso de recursos
```bash
docker stats
```

### Ver tamaño de volúmenes
```bash
docker system df -v
```

## 🔐 Seguridad

1. **Firewall**: Asegúrate de que solo los puertos necesarios estén abiertos
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3001/tcp  # Solo acceso interno
sudo ufw deny 8000/tcp  # Solo acceso interno
```

2. **Actualizar secretos**: Cambia todas las API keys en producción

3. **HTTPS**: Usa siempre HTTPS en producción con Certbot

## 📝 Notas Importantes

- Los PDFs de legislación deben estar en `backend/data/legislacion/` antes de ejecutar la ingesta
- ChromaDB persiste datos en el volumen `chromadb_data`
- El backend se auto-reinicia si falla
- Para producción, considera usar un registry de Docker privado
- Los logs se almacenan en los contenedores (usar `docker-compose logs`)

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica las variables de entorno: `docker-compose config`
3. Asegúrate de que todos los servicios estén corriendo: `docker-compose ps`
