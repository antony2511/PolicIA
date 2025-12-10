import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import { transcribeAudio } from '../services/openaiService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for audio upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max (Whisper limit)
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/m4a',
      'audio/wav',
      'audio/webm',
      'audio/ogg'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de audio no soportado. Usa MP3, M4A, WAV, WEBM u OGG.'));
    }
  }
});

/**
 * POST /api/audio/transcribe
 * Transcribe audio file using Whisper
 */
router.post('/transcribe', verifyToken, upload.single('audio'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No se proporcionó archivo de audio'
      });
    }

    filePath = req.file.path;

    // Transcribe using Whisper
    const transcription = await transcribeAudio(
      fs.createReadStream(filePath)
    );

    // Delete temporary file
    fs.unlinkSync(filePath);

    res.json({
      transcription,
      duration: req.file.size,
      filename: req.file.originalname
    });

  } catch (error) {
    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error('Transcription error:', error);
    res.status(500).json({
      error: 'Error transcribiendo audio',
      message: error.message
    });
  }
});

/**
 * GET /api/audio/formats
 * Get supported audio formats
 */
router.get('/formats', (req, res) => {
  res.json({
    supported: [
      { format: 'mp3', mime: 'audio/mpeg' },
      { format: 'm4a', mime: 'audio/mp4' },
      { format: 'wav', mime: 'audio/wav' },
      { format: 'webm', mime: 'audio/webm' },
      { format: 'ogg', mime: 'audio/ogg' }
    ],
    maxSize: '25MB'
  });
});

export default router;
