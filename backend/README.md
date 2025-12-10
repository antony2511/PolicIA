# PolicIA Backend API

Backend API para el sistema PolicIA - Asistente Policial con IA

## Características

- **Express.js** - Framework web
- **Firebase Admin** - Autenticación y Firestore
- **OpenAI** - GPT-4, Whisper, Embeddings
- **ChromaDB** - Base de datos vectorial para RAG
- **RAG** - Retrieval Augmented Generation con legislación colombiana

## Requisitos Previos

- Node.js 18+
- ChromaDB instalado y corriendo
- Cuenta de Firebase con proyecto configurado
- API Key de OpenAI

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`:
```bash
cp .env .env.local
```

2. Configurar variables de entorno en `.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# Firebase Admin (obtener de Firebase Console)
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="tu-private-key"
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com

# ChromaDB
CHROMA_HOST=localhost
CHROMA_PORT=8000

# CORS
CORS_ORIGIN=http://localhost:3000
```

3. Descargar Service Account de Firebase:
   - Ir a Firebase Console > Project Settings > Service Accounts
   - Generar nueva clave privada
   - Guardar como `firebase-adminsdk.json` en el directorio `backend/`

## Iniciar ChromaDB

ChromaDB debe estar corriendo antes de iniciar el backend:

```bash
# Con Docker
docker run -p 8000:8000 chromadb/chroma

# O instalado localmente
chroma run --host localhost --port 8000
```

## Iniciar Servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints de API

### Health Check
```
GET /health
```

### Chat (con RAG)
```
POST /api/chat
Authorization: Bearer <firebase-token>
Body: {
  "message": "¿Cómo realizar una captura en flagrancia?",
  "history": []
}
```

### Transcripción de Audio
```
POST /api/audio/transcribe
Authorization: Bearer <firebase-token>
Content-Type: multipart/form-data
Body: audio file
```

### Templates
```
GET /api/templates
GET /api/templates/:type
GET /api/templates/free/available
Authorization: Bearer <firebase-token>
```

### Documents
```
POST /api/documents/generate
GET /api/documents/usage
GET /api/documents/history
Authorization: Bearer <firebase-token>
```

## Estructura del Proyecto

```
backend/
├── routes/          # Rutas de API
│   ├── chat.js
│   ├── audio.js
│   ├── templates.js
│   └── documents.js
├── services/        # Lógica de negocio
│   ├── chromaService.js
│   ├── openaiService.js
│   └── ragService.js
├── middleware/      # Middlewares
│   └── auth.js
├── database/        # Configuración DB
│   └── firestore.js
├── data/            # Datos para ingestión
│   └── legislacion/
├── scripts/         # Scripts de utilidad
│   └── ingest-legislacion.js
├── server.js        # Servidor principal
└── package.json
```

## Ingestión de Legislación

Para cargar la legislación colombiana en ChromaDB:

1. Colocar PDFs en `data/legislacion/`:
   - `codigo-penal.pdf`
   - `codigo-procedimiento-penal.pdf`
   - `codigo-nacional-policia.pdf`

2. Ejecutar script de ingestión:
```bash
npm run ingest
```

## Testing

```bash
# Test health check
curl http://localhost:3001/health

# Test chat (requiere token)
curl -X POST http://localhost:3001/api/chat \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test"}'
```

## Notas Importantes

- El servidor usa Firebase Admin SDK para verificar tokens
- ChromaDB debe estar corriendo antes de iniciar
- Los archivos de audio se procesan y eliminan automáticamente
- El sistema RAG requiere que la legislación esté cargada

## Troubleshooting

### Error: ChromaDB no disponible
- Verificar que ChromaDB esté corriendo en `localhost:8000`
- El servidor puede iniciar sin ChromaDB pero las funciones RAG fallarán

### Error: Firebase Admin
- Verificar que `firebase-adminsdk.json` existe
- O que las variables de entorno de Firebase estén configuradas

### Error: OpenAI API
- Verificar que `OPENAI_API_KEY` esté configurada
- Verificar saldo/límites de la cuenta OpenAI
