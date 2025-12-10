import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import ragService from '../services/ragService.js';
import { chatWithRAG } from '../services/openaiService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Send message and get AI response with RAG context
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'El mensaje es requerido'
      });
    }

    // Query RAG system for relevant context
    const ragResults = await ragService.query(message, {
      topK: 5,
      minSimilarity: 0.6
    });

    // Format conversation history
    const conversationHistory = history
      .slice(-10) // Last 10 messages
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    // Generate response with RAG context
    const response = await chatWithRAG(
      message,
      ragResults.context || 'No se encontró contexto legal específico.',
      conversationHistory
    );

    res.json({
      response,
      sources: ragResults.sources || [],
      hasContext: ragResults.found
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Error procesando el mensaje',
      message: error.message
    });
  }
});

/**
 * GET /api/chat/status
 * Check RAG system status
 */
router.get('/status', async (req, res) => {
  try {
    const stats = await ragService.getStats();
    const isReady = await ragService.isReady();

    res.json({
      status: isReady ? 'ready' : 'not_ready',
      ...stats
    });
  } catch (error) {
    res.json({
      status: 'error',
      error: error.message
    });
  }
});

export default router;
