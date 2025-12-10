import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { db } from '../database/firestore.js';
import ragService from '../services/ragService.js';
import { generateDocumentSection } from '../services/openaiService.js';

const router = express.Router();

/**
 * POST /api/documents/generate
 * Generate document with AI assistance
 */
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { templateType, formData } = req.body;
    const userId = req.user.uid;

    if (!templateType || !formData) {
      return res.status(400).json({
        error: 'Se requiere tipo de plantilla y datos del formulario'
      });
    }

    // Check user usage limit
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const userData = userDoc.data();
    const plan = userData.plan || 'free';
    const usage = userData.usage || { documentsThisMonth: 0 };

    // Check monthly reset
    const lastReset = usage.lastReset?.toDate() || new Date();
    const now = new Date();
    const monthDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 +
                      (now.getMonth() - lastReset.getMonth());

    let currentUsage = usage.documentsThisMonth;
    if (monthDiff >= 1) {
      currentUsage = 0;
      await userRef.update({
        'usage.documentsThisMonth': 0,
        'usage.lastReset': now
      });
    }

    // Check limit
    const limit = plan === 'free' ? 2 : 25;
    if (currentUsage >= limit) {
      return res.status(403).json({
        error: 'Límite de documentos alcanzado',
        plan,
        limit,
        used: currentUsage
      });
    }

    // Get template
    const templatesRef = db.collection('templates');
    const templateSnapshot = await templatesRef
      .where('type', '==', templateType)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (templateSnapshot.empty) {
      return res.status(404).json({
        error: 'Plantilla no encontrada'
      });
    }

    const template = templateSnapshot.docs[0].data();

    // Check if template is available for user's plan
    if (plan === 'free' && !template.freeTier) {
      return res.status(403).json({
        error: 'Esta plantilla requiere plan Plus'
      });
    }

    // Generate AI sections
    const generatedSections = {};

    for (const section of template.sections || []) {
      if (section.aiGenerated) {
        // Query RAG for legal context
        const ragResults = await ragService.queryByTopic(templateType, {
          topK: 3
        });

        // Generate section content
        const content = await generateDocumentSection(
          section.aiPrompt,
          ragResults.context || '',
          formData
        );

        generatedSections[section.id] = content;
      }
    }

    // Increment usage counter
    await userRef.update({
      'usage.documentsThisMonth': currentUsage + 1
    });

    // Save document record
    const documentRef = await db.collection('documents').add({
      userId,
      type: templateType,
      formData,
      generatedSections,
      createdAt: now
    });

    res.json({
      documentId: documentRef.id,
      generatedSections,
      usage: {
        used: currentUsage + 1,
        limit,
        remaining: limit - currentUsage - 1
      }
    });

  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({
      error: 'Error generando documento',
      message: error.message
    });
  }
});

/**
 * GET /api/documents/usage
 * Get user's document usage
 */
router.get('/usage', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const userData = userDoc.data();
    const plan = userData.plan || 'free';
    const usage = userData.usage || { documentsThisMonth: 0 };

    const limit = plan === 'free' ? 2 : 25;

    res.json({
      plan,
      used: usage.documentsThisMonth,
      limit,
      remaining: limit - usage.documentsThisMonth,
      lastReset: usage.lastReset
    });

  } catch (error) {
    console.error('Usage check error:', error);
    res.status(500).json({
      error: 'Error obteniendo uso',
      message: error.message
    });
  }
});

/**
 * GET /api/documents/history
 * Get user's document history
 */
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const limit = parseInt(req.query.limit) || 20;

    const documentsRef = db.collection('documents');
    const snapshot = await documentsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const documents = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      documents.push({
        id: doc.id,
        type: data.type,
        createdAt: data.createdAt,
        formData: data.formData
      });
    });

    res.json({
      documents,
      count: documents.length
    });

  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: 'Error obteniendo historial',
      message: error.message
    });
  }
});

export default router;
