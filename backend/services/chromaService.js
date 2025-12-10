import { ChromaClient } from 'chromadb';
import dotenv from 'dotenv';

dotenv.config();

class ChromaService {
  constructor() {
    this.client = null;
    this.collection = null;
    this.collectionName = process.env.CHROMA_COLLECTION || 'legislacion_colombiana';
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize ChromaDB client
      this.client = new ChromaClient({
        path: process.env.CHROMA_HOST || 'http://localhost:8000'
      });

      console.log('🔍 Conectando a ChromaDB...');

      // Get or create collection
      try {
        this.collection = await this.client.getCollection({
          name: this.collectionName
        });
        console.log(`✅ Colección '${this.collectionName}' encontrada`);
      } catch (error) {
        console.log(`📁 Creando colección '${this.collectionName}'...`);
        this.collection = await this.client.createCollection({
          name: this.collectionName,
          metadata: {
            description: 'Legislación colombiana para asistente policial',
            created_at: new Date().toISOString()
          }
        });
        console.log(`✅ Colección '${this.collectionName}' creada`);
      }

      this.initialized = true;
    } catch (error) {
      console.error('❌ Error inicializando ChromaDB:', error.message);
      console.warn('⚠️  ChromaDB no disponible. Asegúrate de tener ChromaDB corriendo.');
      // Don't throw - allow server to start without ChromaDB
    }
  }

  async addDocuments(documents, embeddings, metadatas, ids) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.collection) {
      throw new Error('ChromaDB no está disponible');
    }

    try {
      await this.collection.add({
        documents,
        embeddings,
        metadatas,
        ids
      });

      console.log(`✅ ${documents.length} documentos agregados a ChromaDB`);
      return true;
    } catch (error) {
      console.error('Error agregando documentos a ChromaDB:', error);
      throw error;
    }
  }

  async query(queryEmbeddings, nResults = 5, where = null) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.collection) {
      throw new Error('ChromaDB no está disponible');
    }

    try {
      const results = await this.collection.query({
        queryEmbeddings,
        nResults,
        ...(where && { where })
      });

      return results;
    } catch (error) {
      console.error('Error consultando ChromaDB:', error);
      throw error;
    }
  }

  async getCollection() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.collection;
  }

  async count() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.collection) {
      return 0;
    }

    try {
      const count = await this.collection.count();
      return count;
    } catch (error) {
      console.error('Error contando documentos:', error);
      return 0;
    }
  }

  async deleteCollection() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.client) {
      throw new Error('ChromaDB no está disponible');
    }

    try {
      await this.client.deleteCollection({ name: this.collectionName });
      console.log(`✅ Colección '${this.collectionName}' eliminada`);
      this.collection = null;
      this.initialized = false;
    } catch (error) {
      console.error('Error eliminando colección:', error);
      throw error;
    }
  }
}

// Singleton instance
const chromaService = new ChromaService();

export default chromaService;
