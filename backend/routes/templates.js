import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { db } from '../database/firestore.js';

const router = express.Router();

/**
 * GET /api/templates
 * Get all active templates
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const templatesRef = db.collection('templates');
    const snapshot = await templatesRef.where('isActive', '==', true).get();

    const templates = [];
    snapshot.forEach(doc => {
      templates.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      templates,
      count: templates.length
    });

  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      error: 'Error obteniendo plantillas',
      message: error.message
    });
  }
});

/**
 * GET /api/templates/:type
 * Get template by type
 */
router.get('/:type', verifyToken, async (req, res) => {
  try {
    const { type } = req.params;

    const templatesRef = db.collection('templates');
    const snapshot = await templatesRef
      .where('type', '==', type)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        error: 'Plantilla no encontrada',
        type
      });
    }

    const template = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    res.json(template);

  } catch (error) {
    console.error('Error getting template:', error);
    res.status(500).json({
      error: 'Error obteniendo plantilla',
      message: error.message
    });
  }
});

/**
 * GET /api/templates/free/available
 * Get templates available in free tier
 */
router.get('/free/available', verifyToken, async (req, res) => {
  try {
    const templatesRef = db.collection('templates');
    const snapshot = await templatesRef
      .where('freeTier', '==', true)
      .where('isActive', '==', true)
      .get();

    const templates = [];
    snapshot.forEach(doc => {
      templates.push({
        id: doc.id,
        type: doc.data().type,
        name: doc.data().name
      });
    });

    res.json({
      templates,
      count: templates.length
    });

  } catch (error) {
    console.error('Error getting free templates:', error);
    res.status(500).json({
      error: 'Error obteniendo plantillas gratuitas',
      message: error.message
    });
  }
});

export default router;
