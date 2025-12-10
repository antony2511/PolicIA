# 📊 AVANCE DEL PROYECTO POLICIA-AI

**Fecha de inicio:** 2025-12-09
**Última actualización:** 2025-12-10
**Versión:** 0.4.0 (FASE 3 en progreso - RAG en ingesta)

---

## 📖 CONTEXTO DEL PROYECTO

### ¿Qué es PolicIA?
PolicIA es un **asistente inteligente para la Policía Nacional de Colombia** que utiliza IA para:
1. Consultar legislación colombiana (Código Penal, Procedimiento Penal, Código Nacional de Policía)
2. Guiar procedimientos policiales paso a paso
3. **Redactar automáticamente informes oficiales** usando plantillas estandarizadas
4. Recibir información por voz (Whisper) o texto

### Objetivo Principal
Facilitar el trabajo de campo de los funcionarios policiales mediante:
- Acceso rápido a legislación relevante (RAG)
- Generación automática de informes de captura, actas de incautación, etc.
- Interfaz móvil (PWA) que funciona offline
- Control de uso con modelo freemium

### Modelo de Negocio

**Plan FREE (Gratuito):**
- 2 documentos generados por mes
- Acceso a 2 tipos de procedimientos:
  - Informe Ejecutivo de Captura en Flagrancia
  - Acta de Primer Respondiente
- Consultas IA ilimitadas (sin generar documentos)

**Plan PLUS ($29,900 COP/mes):**
- 25 documentos generados por mes
- Acceso a todos los procedimientos:
  - Informe Ejecutivo de Captura en Flagrancia
  - Acta de Primer Respondiente
  - Formato Derechos del Capturado
  - Acta de Incautación
- Consultas IA ilimitadas
- Soporte prioritario

### Arquitectura Técnica

**Frontend (PWA):**
- React + TypeScript + Vite
- TailwindCSS
- Firebase Auth + Firestore
- Service Worker (offline-first)
- Instalable en móviles

**Backend (API REST):**
- Node.js + Express
- OpenAI GPT-4 (respuestas)
- OpenAI Whisper (voz → texto)
- OpenAI Embeddings (text-embedding-3-small)
- ChromaDB (base vectorial local)
- Firebase Admin (autenticación)

**Base de Datos:**
- **Firestore:** Usuarios, plantillas, documentos, contadores de uso
- **ChromaDB:** Legislación colombiana embeddings (RAG)

### Flujo de Generación de Documentos

1. Usuario selecciona tipo de informe (ej: "Captura en Flagrancia")
2. Sistema verifica límite de uso (Free: 2/mes, Plus: 25/mes)
3. Wizard guiado captura datos:
   - Datos básicos (fecha, lugar, funcionario)
   - Datos del capturado
   - Descripción de hechos (voz 🎤 o texto)
   - Elementos incautados
   - Testigos
4. IA genera secciones usando RAG:
   - Consulta legislación relevante en ChromaDB
   - GPT-4 redacta formalmente con contexto legal
   - Cita artículos aplicables
5. Usuario revisa/edita borrador
6. Sistema genera PDF y/o Word con formato oficial
7. Contador de uso se incrementa

### Sistema RAG (Retrieval Augmented Generation)

**¿Cómo funciona?**
1. Legislación colombiana se procesa y divide en chunks (por artículo)
2. Cada chunk se convierte en embeddings (vectores)
3. Se almacenan en ChromaDB con metadata (fuente, artículo, categoría)
4. Cuando usuario pregunta:
   - Su pregunta se convierte en embedding
   - ChromaDB busca chunks más similares (top 5)
   - GPT-4 responde SOLO con ese contexto legal
5. **Resultado:** Respuestas precisas limitadas a legislación colombiana

**Legislación a Ingestar:**
- Código Penal Colombiano (Ley 599/2000)
- Código de Procedimiento Penal (Ley 906/2004)
- Código Nacional de Policía (Ley 1801/2016)
- Sentencias relevantes de la Corte Constitucional

### Plantillas de Documentos

Las plantillas están en formato JSON con estructura:
```json
{
  "id": "captura-flagrancia-v2",
  "type": "captura-flagrancia",
  "name": "Informe Ejecutivo de Captura en Flagrancia",
  "freeTier": true,
  "fields": [...],        // Campos del formulario
  "sections": [...],      // Secciones del documento
  "pdfConfig": {...}      // Configuración PDF
}
```

Cada sección puede ser:
- **Estática:** Texto fijo con variables ({fecha_hora}, {nombre})
- **Generada por IA:** `aiGenerated: true` con prompt específico

### Estado Actual del Proyecto

**✅ Completado:**
- PWA configurada (manifest, service worker, offline)
- Firebase Auth integrada (login, registro completo, logout, protección de rutas)
- Página de registro completa con validación
- Dashboard con información de usuario autenticado
- Backend API completo (Express + 14 archivos)
- Servicios OpenAI (GPT-4, Whisper, Embeddings)
- ChromaDB configurado
- Sistema RAG implementado
- Control de límites de uso
- Middleware de autenticación
- 8 endpoints de API funcionales
- Backend y Frontend probados exitosamente
- Script de ingesta de legislación creado
- PDFs de legislación colombiana descargados (3 códigos, ~3.8 MB total)

**🔄 En Progreso:**
- Ingesta de legislación en ChromaDB (FASE 3)
  - ✅ Script ingest-legislacion.js creado
  - ✅ PDFs colocados en backend/data/legislacion/
  - 🔄 Procesando artículos y generando embeddings

**⏳ Pendiente:**
- Crear plantillas JSON en Firestore (FASE 4)
- Wizard de creación de informes (FASE 5)
- Componente de grabación de audio (FASE 6)
- Generación PDF/Word (FASE 7)
- UI de control de uso (FASE 8)
- Testing y deploy (FASE 9)

### Decisiones de Diseño Importantes

1. **Plantillas en BD (no hardcoded):** Permite actualizar formatos sin redesplegar
2. **RAG local (ChromaDB):** Evita costos de Pinecone, más privacidad
3. **PWA offline-first:** Funcionarios pueden consultar procedimientos sin internet
4. **Firebase + Firestore:** Evita gestionar servidor de autenticación
5. **Modelo freemium:** Validar producto antes de cobrar
6. **Audio con Whisper:** Facilita uso en campo (manos libres)
7. **PDF + Word:** Flexibilidad para editar después

### Costos Estimados (100 usuarios, 80 free / 20 plus)

- OpenAI API: ~$50/mes (chat, whisper, embeddings, generación)
- Firebase: $0 (tier gratuito hasta 50K lecturas/día)
- VPS: $12/mes (2GB RAM para ChromaDB + backend)
- **Total: ~$62/mes**
- **Break-even:** 3 usuarios Plus

### Endpoints de API Disponibles

```
GET  /health                           # Health check

POST /api/chat                         # Chat con RAG
GET  /api/chat/status                  # Estado RAG

POST /api/audio/transcribe             # Whisper transcription
GET  /api/audio/formats                # Formatos soportados

GET  /api/templates                    # Todas las plantillas
GET  /api/templates/:type              # Plantilla por tipo
GET  /api/templates/free/available     # Plantillas free

POST /api/documents/generate           # Generar informe
GET  /api/documents/usage              # Uso del usuario
GET  /api/documents/history            # Historial
```

Todos los endpoints (excepto `/health`) requieren:
```
Authorization: Bearer <firebase-id-token>
```

---

## ✅ COMPLETADO

### Análisis y Planificación
- ✅ Revisión completa del proyecto existente
- ✅ Definición de arquitectura del sistema
- ✅ Selección de stack tecnológico:
  - Frontend: React + TypeScript + Vite + PWA
  - Backend: Node.js + Express
  - IA: OpenAI GPT-4 + Whisper
  - Base Vectorial: ChromaDB (local)
  - Auth/DB: Firebase Auth + Firestore
  - Documentos: jsPDF + docx.js
- ✅ Diseño de estructura de plantillas JSON
- ✅ Definición de procedimientos:
  - FREE: Captura en Flagrancia, Primer Respondiente (2 docs/mes)
  - PLUS: Los anteriores + Derechos Capturado + Acta Incautación (25 docs/mes)
- ✅ Plan de implementación en 9 fases documentado

### FASE 1: Setup PWA + Firebase Auth ✅
- ✅ Configuración de manifest.json
- ✅ Implementación de Service Worker (sw.js)
- ✅ Creación de página offline.html
- ✅ Configuración de Firebase
- ✅ Creación de FirebaseContext
- ✅ Creación de firebaseService.ts con funciones:
  - Login/Register/Logout
  - Gestión de perfiles de usuario
  - Control de límites de uso
  - Guardado de documentos
- ✅ Actualización de Login.tsx con Firebase Auth
- ✅ Creación de Register.tsx con formulario completo:
  - Campos: displayName, rank, email, password, confirmPassword
  - Validación de contraseñas coincidentes
  - Validación de longitud mínima (6 caracteres)
  - Manejo de errores de Firebase
  - Integración con AuthContext
- ✅ Actualización de Dashboard.tsx:
  - Mostrar información de usuario autenticado (rank, displayName)
  - Botón de cerrar sesión funcional
  - Navegación a planes
- ✅ Protección de rutas con ProtectedRoute
- ✅ Instalación de dependencia: firebase
- ✅ Actualización de .env.local con variables
- ✅ Creación de usuario de prueba en Firebase
- ✅ Testing completo de login/logout

---

### FASE 2: Backend API + ChromaDB ✅
- ✅ Setup Node.js/Express servidor
- ✅ Instalación de dependencias (302 paquetes)
- ✅ Configuración ChromaDB service
- ✅ Creación de servicios:
  - openaiService.js (GPT-4, Whisper, Embeddings)
  - chromaService.js (Base vectorial)
  - ragService.js (RAG system)
- ✅ Middleware de autenticación Firebase
- ✅ Creación de rutas API:
  - `POST /api/chat` - Consultas con RAG
  - `POST /api/documents/generate` - Generar informe
  - `POST /api/audio/transcribe` - Whisper
  - `GET /api/templates` - Obtener plantillas
  - `GET /api/documents/usage` - Uso del usuario
  - `GET /api/documents/history` - Historial
- ✅ Configuración CORS y manejo de errores
- ✅ README del backend con documentación

---

## 🚧 EN PROGRESO

### FASE 3: RAG - Ingestar legislación colombiana 🔄
- ✅ Script ingest-legislacion.js creado y funcional
- ✅ PDFs descargados y colocados en backend/data/legislacion/:
  - ✅ Código Penal Colombiano (codigo-penal.pdf - 836 KB)
  - ✅ Código Procedimiento Penal (Codigo_de_procedimiento_penal.pdf - 1.9 MB)
  - ✅ Código Nacional Policía (codigo-policia.pdf - 1.1 MB)
- ✅ Parseo de PDFs implementado (pdf-parse)
- ✅ Chunking por artículo con regex pattern
- ✅ Generación de embeddings con OpenAI (text-embedding-3-small)
- 🔄 **Ejecutando ingesta** (puede tardar 5-15 minutos)
  - Proceso actual: Extrayendo artículos y generando embeddings
  - Procesamiento en lotes de 10 artículos
  - Delay de 100ms entre embeddings para evitar rate limit
- ⏳ Testing de retrieval (pendiente hasta que termine ingesta)

**Características del script:**
- Detecta artículos automáticamente con patrón regex
- Fallback a chunking simple si no detecta artículos
- Procesamiento por lotes para optimizar API calls
- Metadata completa: lawName, lawType, articleNumber, source
- Logging detallado del progreso

---

## 📋 PENDIENTE

### FASE 4: Sistema de plantillas
- ⬜ Creación de plantillas JSON:
  - captura-flagrancia.json
  - primer-respondiente.json
  - derechos-capturado.json
  - acta-incautacion.json
- ⬜ Almacenamiento en Firestore
- ⬜ Servicio templateService.ts
- ⬜ Endpoint GET /api/templates/:type
- ⬜ Validación de campos

### FASE 5: Wizard de creación de informes
- ⬜ Componente CreateReport.tsx (multi-step form)
- ⬜ Componentes de formularios:
  - BasicDataForm.tsx
  - CapturedPersonForm.tsx
  - FactsDescriptionForm.tsx
  - EvidenceForm.tsx
  - WitnessesForm.tsx
  - ReviewForm.tsx
- ⬜ Validación por paso
- ⬜ Auto-guardado localStorage
- ⬜ Integración con backend

### FASE 6: Integración Whisper (audio)
- ⬜ Componente AudioRecorder.tsx
- ⬜ Visualización de onda de audio
- ⬜ Endpoint POST /api/audio/transcribe
- ⬜ Integración en FactsDescriptionForm.tsx

### FASE 7: Generación PDF/Word
- ⬜ Servicio documentService.ts
- ⬜ Función generatePDF con jsPDF
- ⬜ Función generateWord con docx.js
- ⬜ Aplicación de estilos oficiales
- ⬜ Inserción de logo Policía
- ⬜ Componente DocumentPreview.tsx
- ⬜ Upload a Firebase Storage

### FASE 8: Control de uso y planes
- ⬜ Componente UsageIndicator.tsx
- ⬜ Componente PlanGate.tsx
- ⬜ Lógica validación límites backend
- ⬜ Sistema de incremento de contadores
- ⬜ Reset automático mensual (Cloud Function)
- ⬜ Actualización Plans.tsx con datos reales

### FASE 9: Testing y optimización
- ⬜ Testing end-to-end flujo completo
- ⬜ Optimización caching PWA
- ⬜ Compresión de imágenes
- ⬜ Lazy loading de componentes
- ⬜ Documentación de usuario
- ⬜ Deploy final

---

## 📦 DEPENDENCIAS INSTALADAS

### Frontend
- ✅ firebase
- ⬜ workbox-webpack-plugin
- ⬜ workbox-window
- ⬜ react-hook-form
- ⬜ jspdf
- ⬜ docx

### Backend
- ✅ express
- ✅ cors
- ✅ dotenv
- ✅ firebase-admin
- ✅ chromadb
- ✅ openai
- ✅ pdf-parse
- ✅ multer
- ✅ uuid
- ✅ nodemon (dev)

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS (Para próxima sesión)

**FASE 3: RAG - Ingestar Legislación Colombiana**
1. Crear script `ingest-legislacion.js` para procesar PDFs
2. Descargar/obtener PDFs de legislación:
   - Código Penal (Ley 599/2000)
   - Código Procedimiento Penal (Ley 906/2004)
   - Código Nacional Policía (Ley 1801/2016)
3. Implementar chunking por artículo
4. Generar embeddings con OpenAI
5. Cargar en ChromaDB con metadata
6. Probar sistema RAG con queries de ejemplo

**Antes de continuar:**
- ✅ Configurar proyecto Firebase y obtener credenciales
- ✅ Obtener OpenAI API Key
- ✅ Instalar y correr ChromaDB (Docker o local)
- ✅ Actualizar variables de entorno en `.env.local` y `backend/.env`

---

## 📝 NOTAS IMPORTANTES

- Las plantillas de formatos están estandarizadas y se almacenarán en la base de datos
- Sistema debe soportar entrada por voz (Whisper) y texto
- Exportación en PDF y Word simultáneamente
- Control estricto de límites: Free (2 docs/mes) vs Plus (25 docs/mes)
- RAG limitado a legislación colombiana específica
- PWA debe funcionar offline para consultas básicas

### Archivos Creados:

**FASE 1 - PWA + Firebase Auth:**
- `public/manifest.json` - Configuración PWA
- `public/sw.js` - Service Worker
- `public/offline.html` - Página offline
- `config/firebase.ts` - Configuración Firebase
- `services/firebaseService.ts` - Servicios Firebase
- `contexts/AuthContext.tsx` - Contexto de autenticación
- `components/ProtectedRoute.tsx` - HOC para rutas protegidas
- `utils/registerSW.ts` - Registro de Service Worker
- `pages/Register.tsx` - Página de registro completa
- `pages/Login.tsx` - Actualizado con link a registro
- `pages/Dashboard.tsx` - Actualizado con logout y datos de usuario
- `types.ts` - Actualizado con ruta REGISTER
- `App.tsx` - Actualizado con ruta de registro

**FASE 2 - Backend API:**
- `backend/server.js` - Servidor Express
- `backend/package.json` - Dependencias backend
- `backend/scripts/create-test-user.js` - Script crear usuario de prueba

**FASE 3 - Sistema RAG:**
- `backend/scripts/ingest-legislacion.js` - Script de ingesta de legislación
- `backend/data/legislacion/README.md` - Instrucciones de PDFs
- `backend/data/legislacion/codigo-penal.pdf` - Código Penal (836 KB)
- `backend/data/legislacion/Codigo_de_procedimiento_penal.pdf` - CPP (1.9 MB)
- `backend/data/legislacion/codigo-policia.pdf` - Código Policía (1.1 MB)
- `backend/.env` - Variables de entorno
- `backend/database/firestore.js` - Firebase Admin
- `backend/services/chromaService.js` - ChromaDB
- `backend/services/openaiService.js` - OpenAI API
- `backend/services/ragService.js` - Sistema RAG
- `backend/middleware/auth.js` - Middleware autenticación
- `backend/routes/chat.js` - Endpoints chat
- `backend/routes/audio.js` - Endpoints audio (Whisper)
- `backend/routes/templates.js` - Endpoints plantillas
- `backend/routes/documents.js` - Endpoints documentos
- `backend/README.md` - Documentación backend

---

## ⚠️ BLOQUEADORES / DECISIONES PENDIENTES

### Configuración Pendiente:
1. **Firebase Project Setup:**
   - Crear proyecto en https://console.firebase.google.com/
   - Habilitar Authentication > Email/Password
   - Crear Firestore Database
   - Descargar Service Account JSON (`firebase-adminsdk.json`)
   - Copiar credenciales web a `.env.local` (frontend)
   - Copiar credenciales admin a `backend/.env` (backend)

2. **OpenAI API Key:**
   - Registrarse en https://platform.openai.com/
   - Crear API Key
   - Agregar saldo a la cuenta (mínimo $5 USD)
   - Configurar en `backend/.env`:
     ```
     OPENAI_API_KEY=sk-proj-...
     ```

3. **ChromaDB Setup:**
   - **Opción A (Docker - Recomendada):**
     ```bash
     docker run -p 8000:8000 chromadb/chroma
     ```
   - **Opción B (Local):**
     ```bash
     pip install chromadb
     chroma run --host localhost --port 8000
     ```

4. **PDFs de Legislación:**
   - Fuentes oficiales para descargar:
     - Código Penal: https://www.funcionpublica.gov.co/
     - Código Procedimiento Penal: https://www.funcionpublica.gov.co/
     - Código Nacional Policía: https://www.policia.gov.co/
   - Colocar PDFs en: `backend/data/legislacion/`

### Comandos para Verificar Setup:

**Verificar Frontend:**
```bash
cd policia-ai
npm run dev
# Debe abrir en http://localhost:3000
```

**Verificar Backend:**
```bash
cd backend
npm run dev
# Debe mostrar: "🚀 PolicIA Backend API iniciado"
# Probar: curl http://localhost:3001/health
```

**Verificar ChromaDB:**
```bash
curl http://localhost:8000/api/v1/heartbeat
# Debe responder con timestamp
```

---

## 🐳 Configuración Docker

El proyecto está listo para desplegarse con Docker Compose. Archivos creados:

- `docker-compose.yml` - Orquestación de servicios (ChromaDB, Backend, Frontend)
- `backend/Dockerfile` - Imagen del backend
- `backend/.dockerignore` - Exclusiones para Docker
- `.dockerignore` - Exclusiones globales
- `backend/.env.example` - Template de variables de entorno
- `DEPLOY.md` - Guía completa de deployment
- `README-SERVIDOR.md` - Guía paso a paso rápida

### Servicios en Docker Compose:

1. **chromadb**: Base de datos vectorial (puerto 8000)
   - Imagen: chromadb/chroma:latest
   - Volumen persistente: chromadb_data

2. **backend**: API Node.js/Express (puerto 3001)
   - Build desde Dockerfile
   - Conectado a ChromaDB

3. **frontend**: React PWA (puerto 3000)
   - Hot reload para desarrollo

### Para desplegar en servidor:

```bash
# 1. Subir proyecto al servidor
scp -r policia-ai/ usuario@servidor:/home/usuario/

# 2. Configurar .env en backend/

# 3. Levantar servicios
docker-compose up -d

# 4. Ingestar legislación
docker-compose exec backend npm run ingest
```

---

**Progreso general:** 42% completado (FASE 1 y 2 completadas, configuración Docker lista, preparado para deploy en servidor)
