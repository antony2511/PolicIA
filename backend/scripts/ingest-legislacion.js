import chromaService from '../services/chromaService.js';
import { generateEmbedding } from '../services/openaiService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const LEGISLACION_DIR = path.join(__dirname, '../data/legislacion');
const CHUNK_SIZE = 1000; // caracteres por chunk
const OVERLAP = 200; // overlap entre chunks

/**
 * Extrae texto de un PDF
 */
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error extrayendo texto de ${pdfPath}:`, error.message);
    return null;
  }
}

/**
 * Divide el texto en chunks con overlap
 */
function chunkText(text, chunkSize = CHUNK_SIZE, overlap = OVERLAP) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    start += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Extrae artículos de la legislación (patrón simplificado)
 */
function extractArticles(text, lawName) {
  const articles = [];

  // Patrón para detectar artículos: "ARTÍCULO 123." o "Artículo 123."
  const articlePattern = /(?:ARTÍCULO|Artículo)\s+(\d+)[°ºª]?\s*\.?\s*([^]*?)(?=(?:ARTÍCULO|Artículo)\s+\d+|$)/gi;

  let match;
  while ((match = articlePattern.exec(text)) !== null) {
    const articleNumber = match[1];
    const articleText = match[2].trim();

    // Limpiar el texto del artículo (máximo 2000 caracteres)
    const cleanText = articleText.slice(0, 2000).replace(/\s+/g, ' ').trim();

    if (cleanText.length > 50) { // Evitar artículos muy cortos
      articles.push({
        number: articleNumber,
        text: cleanText,
        lawName: lawName
      });
    }
  }

  return articles;
}

/**
 * Procesa un archivo PDF de legislación
 */
async function processPDF(pdfPath, lawName, lawType) {
  console.log(`\n📄 Procesando: ${lawName}...`);

  // Extraer texto
  const text = await extractTextFromPDF(pdfPath);
  if (!text) {
    console.error(`❌ No se pudo extraer texto de ${pdfPath}`);
    return 0;
  }

  console.log(`📝 Texto extraído: ${text.length} caracteres`);

  // Intentar extraer artículos
  let articles = extractArticles(text, lawName);

  if (articles.length === 0) {
    // Si no se encontraron artículos, usar chunking simple
    console.log('⚠️  No se detectaron artículos. Usando chunking simple...');
    const chunks = chunkText(text);
    articles = chunks.map((chunk, idx) => ({
      number: `chunk-${idx + 1}`,
      text: chunk,
      lawName: lawName
    }));
  } else {
    console.log(`📋 Artículos detectados: ${articles.length}`);
  }

  // Procesar cada artículo
  let successCount = 0;
  const batchSize = 10; // Procesar en lotes de 10

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);

    console.log(`\n🔄 Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(articles.length / batchSize)}...`);

    const embeddings = [];
    const documents = [];
    const metadatas = [];
    const ids = [];

    for (const article of batch) {
      try {
        // Generar embedding
        const embedding = await generateEmbedding(article.text);

        embeddings.push(embedding);
        documents.push(article.text);
        metadatas.push({
          lawName: lawName,
          lawType: lawType,
          articleNumber: article.number,
          source: path.basename(pdfPath)
        });
        ids.push(`${lawType}-${article.number}-${Date.now()}-${successCount}`);

        successCount++;

        // Delay entre embeddings para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error procesando artículo ${article.number}:`, error.message);
      }
    }

    // Agregar el lote a ChromaDB
    if (embeddings.length > 0) {
      try {
        await chromaService.addDocuments(documents, embeddings, metadatas, ids);
        console.log(`✅ Lote agregado: ${embeddings.length} artículos`);
      } catch (error) {
        console.error(`❌ Error agregando lote a ChromaDB:`, error.message);
      }
    }
  }

  console.log(`\n✅ ${lawName}: ${successCount} artículos procesados`);
  return successCount;
}

/**
 * Función principal de ingesta
 */
async function ingestLegislacion() {
  console.log('🚀 INICIANDO INGESTA DE LEGISLACIÓN COLOMBIANA\n');
  console.log('='.repeat(60));

  try {
    // Verificar directorio
    if (!fs.existsSync(LEGISLACION_DIR)) {
      console.error(`❌ El directorio ${LEGISLACION_DIR} no existe`);
      console.log('\n📝 Crea la carpeta y coloca los PDFs:');
      console.log('   backend/data/legislacion/');
      process.exit(1);
    }

    // Listar PDFs disponibles
    const files = fs.readdirSync(LEGISLACION_DIR).filter(f => f.endsWith('.pdf'));

    if (files.length === 0) {
      console.error(`❌ No se encontraron archivos PDF en ${LEGISLACION_DIR}`);
      console.log('\n📝 Descarga los siguientes documentos y colócalos en backend/data/legislacion/:');
      console.log('   1. Código Penal Colombiano (Ley 599/2000)');
      console.log('   2. Código de Procedimiento Penal (Ley 906/2004)');
      console.log('   3. Código Nacional de Policía (Ley 1801/2016)');
      process.exit(1);
    }

    console.log(`\n📚 PDFs encontrados: ${files.length}`);
    files.forEach(f => console.log(`   - ${f}`));

    // Inicializar ChromaDB
    console.log('\n🔌 Conectando a ChromaDB...');
    await chromaService.initialize();
    console.log('✅ ChromaDB conectado');

    // Verificar si ya hay documentos
    const currentCount = await chromaService.count();
    console.log(`📊 Documentos actuales en ChromaDB: ${currentCount}`);

    if (currentCount > 0) {
      console.log('\n⚠️  Ya existen documentos en la colección.');
      console.log('Para reingestar, elimina la colección primero.');
      // Puedes implementar lógica para preguntar si quiere continuar
    }

    // Mapeo de archivos (ajusta según tus archivos)
    const lawMapping = {
      'codigo-penal': { name: 'Código Penal Colombiano (Ley 599/2000)', type: 'penal' },
      'codigo-procedimiento-penal': { name: 'Código de Procedimiento Penal (Ley 906/2004)', type: 'procedimiento' },
      'codigo-policia': { name: 'Código Nacional de Policía (Ley 1801/2016)', type: 'policia' },
      'default': { name: 'Legislación Colombiana', type: 'general' }
    };

    // Procesar cada PDF
    let totalProcessed = 0;
    for (const file of files) {
      const pdfPath = path.join(LEGISLACION_DIR, file);
      const baseName = path.basename(file, '.pdf').toLowerCase();

      // Identificar el tipo de ley
      let lawInfo = lawMapping.default;
      for (const [key, value] of Object.entries(lawMapping)) {
        if (baseName.includes(key)) {
          lawInfo = value;
          break;
        }
      }

      const count = await processPDF(pdfPath, lawInfo.name, lawInfo.type);
      totalProcessed += count;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 INGESTA COMPLETADA`);
    console.log(`📊 Total de artículos procesados: ${totalProcessed}`);

    const finalCount = await chromaService.count();
    console.log(`📊 Total de documentos en ChromaDB: ${finalCount}`);

    // Test query
    console.log('\n🔍 Probando búsqueda...');
    const testResults = await chromaService.query('captura en flagrancia', 3);
    console.log(`✅ Encontrados ${testResults.documents[0]?.length || 0} resultados relevantes`);

    if (testResults.documents[0]?.length > 0) {
      console.log('\n📄 Primer resultado:');
      console.log(testResults.documents[0][0].substring(0, 200) + '...');
    }

  } catch (error) {
    console.error('\n❌ ERROR EN LA INGESTA:', error);
    process.exit(1);
  }
}

// Ejecutar si es el script principal
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestLegislacion()
    .then(() => {
      console.log('\n✅ Proceso finalizado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error fatal:', error);
      process.exit(1);
    });
}

export { ingestLegislacion, extractArticles, chunkText };
