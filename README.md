# 🚔 PolicIA - Asistente Policial con IA

Sistema de asistencia inteligente para la Policía Nacional de Colombia que utiliza IA para consultar legislación y generar informes oficiales automáticamente.

## 🎯 Características

- 🤖 **Chat IA con RAG**: Consulta legislación colombiana (Código Penal, Procedimiento Penal, Código de Policía)
- 📄 **Generación Automática de Informes**: 4 tipos de documentos oficiales
- 🎤 **Entrada por Voz**: Transcripción con OpenAI Whisper
- 📱 **PWA**: Funciona offline y se puede instalar en móviles
- 🔐 **Sistema Freemium**: Plan Free (2 docs/mes) y Plus (25 docs/mes)
- 📊 **Control de Uso**: Límites mensuales y seguimiento automático

## 🏗️ Arquitectura

### Frontend (PWA)
- React + TypeScript + Vite
- TailwindCSS
- Firebase Auth + Firestore
- Service Worker (offline-first)

### Backend (API REST)
- Node.js + Express
- OpenAI GPT-4 + Whisper + Embeddings
- ChromaDB (base de datos vectorial)
- Firebase Admin SDK

### Infraestructura
- Docker + Docker Compose
- ChromaDB para RAG
- Firestore para usuarios y documentos

## 🚀 Deploy Rápido

### Prerrequisitos
- Docker y Docker Compose instalados
- Cuenta Firebase configurada
- OpenAI API Key

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/policia-ai.git
cd policia-ai
```

### 2. Configurar Variables de Entorno

```bash
# Backend
cd backend
cp .env.example .env
nano .env
```

Completar con tus credenciales:
```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
OPENAI_API_KEY=sk-proj-...
CHROMA_HOST=http://chromadb:8000
```

```bash
# Frontend
cd ..
cp .env.local.example .env.local
nano .env.local
```

Agregar credenciales de Firebase (web):
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### 3. Levantar Servicios

```bash
docker-compose up -d
```

### 4. Ingestar Legislación

```bash
# Copiar PDFs a backend/data/legislacion/ y luego:
docker-compose exec backend npm run ingest
```

### 5. Acceder

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- ChromaDB: http://localhost:8000

## 📚 Documentación

- [Guía de Deploy Completa](DEPLOY.md)
- [Guía Rápida para Servidor](README-SERVIDOR.md)
- [Avance del Proyecto](AVANCE.md)

## 🎨 Tipos de Documentos

### Plan Free (2/mes)
1. **Informe Ejecutivo de Captura en Flagrancia**
2. **Acta de Primer Respondiente**

### Plan Plus (25/mes)
3. **Formato Derechos del Capturado**
4. **Acta de Incautación**

## 🛠️ Desarrollo Local

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Ingestar Legislación (local)
```bash
cd backend
npm run ingest
```

## 📦 Estructura del Proyecto

```
policia-ai/
├── backend/                 # API Backend
│   ├── services/           # OpenAI, ChromaDB, RAG
│   ├── routes/             # Endpoints API
│   ├── middleware/         # Autenticación
│   ├── scripts/            # Scripts de utilidad
│   └── data/legislacion/   # PDFs de legislación
├── pages/                  # Páginas React
├── components/             # Componentes reutilizables
├── contexts/               # Contextos de React
├── services/               # Servicios Firebase
├── public/                 # Assets estáticos + PWA
├── docker-compose.yml      # Orquestación Docker
└── DEPLOY.md              # Guía de deployment
```

## 🔒 Seguridad

- ✅ Autenticación con Firebase
- ✅ Tokens JWT en todas las peticiones
- ✅ Variables de entorno para secretos
- ✅ .gitignore configurado para no subir credenciales
- ✅ CORS configurado
- ⚠️ **IMPORTANTE**: Nunca subas archivos `.env` o `firebase-adminsdk.json` a GitHub

## 🐳 Docker

El proyecto incluye configuración completa de Docker Compose:

```bash
# Levantar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Reconstruir
docker-compose build --no-cache
```

## 📊 Estado del Proyecto

- ✅ FASE 1: PWA + Firebase Auth (100%)
- ✅ FASE 2: Backend API + ChromaDB (100%)
- 🔄 FASE 3: RAG - Ingesta de legislación (90% - listo para deploy)
- ⏳ FASE 4: Sistema de plantillas (0%)
- ⏳ FASE 5: Wizard de informes (0%)
- ⏳ FASE 6: Integración Whisper (0%)
- ⏳ FASE 7: Generación PDF/Word (0%)
- ⏳ FASE 8: UI de planes (0%)
- ⏳ FASE 9: Testing y deploy (0%)

**Progreso general: 42%**

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y está en desarrollo.

## 👨‍💻 Autor

Proyecto desarrollado para la Policía Nacional de Colombia

## 🆘 Soporte

Para problemas o preguntas, revisa:
1. [DEPLOY.md](DEPLOY.md) - Troubleshooting
2. [AVANCE.md](AVANCE.md) - Estado del proyecto
3. Issues de GitHub

---

**Nota**: Asegúrate de configurar correctamente las variables de entorno antes de desplegar en producción.
