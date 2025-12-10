import chromaService from './chromaService.js';
import { generateEmbedding } from './openaiService.js';

class RAGService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    await chromaService.initialize();
    this.initialized = true;
  }

  /**
   * Query the RAG system for relevant legal context
   */
  async query(userQuery, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const {
      topK = 5,
      filter = null,
      minSimilarity = 0.7
    } = options;

    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(userQuery);

      // Query ChromaDB
      const results = await chromaService.query(
        [queryEmbedding],
        topK,
        filter
      );

      // Format results
      if (!results || !results.documents || results.documents.length === 0) {
        return {
          context: '',
          sources: [],
          found: false
        };
      }

      const documents = results.documents[0];
      const metadatas = results.metadatas[0];
      const distances = results.distances[0];

      // Filter by similarity threshold
      const relevantResults = documents
        .map((doc, index) => ({
          content: doc,
          metadata: metadatas[index],
          similarity: 1 - distances[index] // Convert distance to similarity
        }))
        .filter(result => result.similarity >= minSimilarity);

      if (relevantResults.length === 0) {
        return {
          context: '',
          sources: [],
          found: false
        };
      }

      // Build context string
      const context = relevantResults
        .map((result, index) => {
          const source = result.metadata.source || 'Desconocido';
          const article = result.metadata.article || '';
          return `[${index + 1}] ${source}${article ? ` - ${article}` : ''}:\n${result.content}`;
        })
        .join('\n\n');

      // Extract sources
      const sources = relevantResults.map(result => ({
        source: result.metadata.source,
        article: result.metadata.article,
        category: result.metadata.category,
        similarity: result.similarity
      }));

      return {
        context,
        sources,
        found: true,
        count: relevantResults.length
      };

    } catch (error) {
      console.error('Error en RAG query:', error);
      throw error;
    }
  }

  /**
   * Query for specific legal topic
   */
  async queryByTopic(topic, options = {}) {
    const queries = {
      'captura-flagrancia': 'procedimiento de captura en flagrancia según código penal colombiano',
      'derechos-capturado': 'derechos del capturado según código de procedimiento penal',
      'primer-respondiente': 'protocolo de primer respondiente y preservación de escena',
      'incautacion': 'procedimiento de incautación de elementos materiales probatorios'
    };

    const query = queries[topic] || topic;
    return await this.query(query, options);
  }

  /**
   * Get collection statistics
   */
  async getStats() {
    if (!this.initialized) {
      await this.initialize();
    }

    const count = await chromaService.count();

    return {
      totalDocuments: count,
      collection: chromaService.collectionName,
      status: count > 0 ? 'ready' : 'empty'
    };
  }

  /**
   * Check if RAG system is ready
   */
  async isReady() {
    try {
      const stats = await this.getStats();
      return stats.totalDocuments > 0;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
const ragService = new RAGService();

export default ragService;
