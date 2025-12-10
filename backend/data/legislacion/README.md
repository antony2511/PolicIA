# 📚 Legislación Colombiana - PDFs

Coloca aquí los archivos PDF de la legislación colombiana para el sistema RAG.

## 📄 Archivos Requeridos

### 1. Código Penal Colombiano (Ley 599/2000)
- **Nombre sugerido:** `codigo-penal.pdf`
- **Fuente:** https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=6388
- **Descripción:** Define los delitos y penas en Colombia

### 2. Código de Procedimiento Penal (Ley 906/2004)
- **Nombre sugerido:** `codigo-procedimiento-penal.pdf`
- **Fuente:** https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=14787
- **Descripción:** Regula el proceso penal en Colombia (Sistema Penal Acusatorio)

### 3. Código Nacional de Policía y Convivencia (Ley 1801/2016)
- **Nombre sugerido:** `codigo-policia.pdf`
- **Fuente:** https://www.policia.gov.co/normatividad/codigo-nacional-policia-convivencia
- **Descripción:** Regula las funciones de la Policía y convivencia ciudadana

## 📥 Instrucciones de Descarga

1. Visita las fuentes oficiales listadas arriba
2. Descarga los PDFs de las leyes completas
3. Renombra los archivos según los nombres sugeridos
4. Colócalos en esta carpeta: `backend/data/legislacion/`

## 🚀 Ejecución de la Ingesta

Una vez descargados los PDFs, ejecuta:

```bash
cd backend
npm run ingest
```

El script:
- ✅ Extrae texto de los PDFs
- ✅ Identifica artículos automáticamente
- ✅ Genera embeddings con OpenAI
- ✅ Almacena en ChromaDB

## 📊 Estructura Esperada

```
backend/data/legislacion/
├── codigo-penal.pdf
├── codigo-procedimiento-penal.pdf
└── codigo-policia.pdf
```

## ⚠️ Notas Importantes

- Los PDFs deben ser texto (no imágenes escaneadas)
- El proceso puede tardar varios minutos dependiendo del tamaño
- Requiere OpenAI API Key configurada
- Requiere ChromaDB corriendo (puerto 8000)
