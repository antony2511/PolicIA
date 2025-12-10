# 🚀 Desplegar PolicIA en Servidor

## Paso a Paso Rápido

### 1️⃣ Preparar Archivos Localmente

Antes de subir al servidor, asegúrate de tener:

```bash
# Verificar que existen los PDFs
ls backend/data/legislacion/
# Debe mostrar:
# - codigo-penal.pdf
# - Codigo_de_procedimiento_penal.pdf
# - codigo-policia.pdf
```

### 2️⃣ Subir al Servidor

```bash
# Comprimir proyecto (excluyendo node_modules)
tar -czf policia-ai.tar.gz policia-ai/ --exclude=node_modules --exclude=.git

# Subir al servidor
scp policia-ai.tar.gz usuario@tu-servidor:/home/usuario/

# Conectar al servidor
ssh usuario@tu-servidor

# Descomprimir
cd /home/usuario
tar -xzf policia-ai.tar.gz
cd policia-ai
```

### 3️⃣ Configurar Variables de Entorno

```bash
# Backend
cd backend
nano .env
```

Pega tus credenciales reales (las mismas que tienes localmente):

```env
FIREBASE_PROJECT_ID=policia-ai-d5f3b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[TU_CLAVE_AQUÍ]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@policia-ai-d5f3b.iam.gserviceaccount.com
OPENAI_API_KEY=sk-proj-...
CHROMA_HOST=http://chromadb:8000
CHROMA_COLLECTION=legislacion_colombiana
PORT=3001
NODE_ENV=production
```

Guardar con `Ctrl+O`, `Enter`, `Ctrl+X`

### 4️⃣ Levantar con Docker Compose

```bash
cd ..  # Volver a raíz del proyecto

# Levantar todos los servicios
docker-compose up -d

# Ver logs para verificar que todo funciona
docker-compose logs -f
```

Deberías ver:
```
✅ ChromaDB conectado
✅ Firebase Admin inicializado
🚀 PolicIA Backend API iniciado en puerto 3001
```

### 5️⃣ Ingestar Legislación

```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Ejecutar ingesta (tardará 10-15 minutos)
npm run ingest

# Esperar a que termine y salir
exit
```

### 6️⃣ Verificar

```bash
# Verificar ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Verificar Backend
curl http://localhost:3001/health

# Ver cuántos documentos se ingirieron
docker-compose exec backend sh -c "node -e \"
import chromaService from './services/chromaService.js';
await chromaService.initialize();
const count = await chromaService.count();
console.log('Documentos en ChromaDB:', count);
\""
```

## 🌐 Acceder desde Internet

### Opción A: Nginx Reverse Proxy (Recomendado)

```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/policia-ai
```

Pegar:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/policia-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Instalar SSL
sudo certbot --nginx -d tu-dominio.com
```

### Opción B: Abrir Puertos Directamente

```bash
# Abrir puertos en firewall
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

# Acceder:
# Frontend: http://IP-SERVIDOR:3000
# Backend: http://IP-SERVIDOR:3001
```

## 📊 Comandos Útiles

```bash
# Ver servicios corriendo
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra ChromaDB)
docker-compose down -v

# Ver uso de recursos
docker stats
```

## ⚠️ Troubleshooting

### ChromaDB no inicia
```bash
docker-compose logs chromadb
# Si dice "port already in use", matar proceso:
sudo lsof -i :8000
sudo kill -9 [PID]
```

### Backend no se conecta a ChromaDB
```bash
# Verificar que estén en la misma red
docker-compose exec backend ping chromadb
# Debe responder
```

### No se puede ingestar legislación
```bash
# Verificar que los PDFs existen
docker-compose exec backend ls -lh data/legislacion/

# Si no están, copiarlos:
docker cp backend/data/legislacion/codigo-penal.pdf policia-backend:/app/data/legislacion/
```

## 🔒 Seguridad

1. **NO expongas ChromaDB directamente** (puerto 8000)
2. **Usa HTTPS** en producción con Certbot
3. **Protege el archivo .env** con permisos adecuados:
   ```bash
   chmod 600 backend/.env
   ```

## ✅ Checklist de Deploy

- [ ] PDFs de legislación copiados
- [ ] Variables de entorno configuradas (backend/.env)
- [ ] Docker Compose levantado (`docker-compose up -d`)
- [ ] ChromaDB respondiendo (curl localhost:8000)
- [ ] Backend respondiendo (curl localhost:3001/health)
- [ ] Legislación ingerida (`npm run ingest` dentro del contenedor)
- [ ] Frontend accesible
- [ ] Nginx configurado (opcional)
- [ ] SSL instalado (opcional)

## 📞 Acceso Rápido

Una vez desplegado:

- **Frontend**: http://tu-dominio.com o http://IP:3000
- **Backend API**: http://tu-dominio.com/api o http://IP:3001
- **Logs**: `docker-compose logs -f`

¡Listo! 🎉
