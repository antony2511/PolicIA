import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const GPT_MODEL = process.env.GPT_MODEL || 'gpt-4';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const WHISPER_MODEL = process.env.WHISPER_MODEL || 'whisper-1';

/**
 * Generate embeddings for text using OpenAI
 */
export const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generando embedding:', error);
    throw error;
  }
};

/**
 * Generate embeddings for multiple texts
 */
export const generateEmbeddings = async (texts) => {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts
    });

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generando embeddings:', error);
    throw error;
  }
};

/**
 * Chat completion with GPT
 */
export const chatCompletion = async (messages, options = {}) => {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || GPT_MODEL,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens,
      top_p: options.topP ?? 1,
      frequency_penalty: options.frequencyPenalty ?? 0,
      presence_penalty: options.presencePenalty ?? 0
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error en chat completion:', error);
    throw error;
  }
};

/**
 * Transcribe audio using Whisper
 */
export const transcribeAudio = async (audioFile) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: 'es',
      response_format: 'json'
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribiendo audio:', error);
    throw error;
  }
};

/**
 * Generate chat response with RAG context
 */
export const chatWithRAG = async (userMessage, ragContext, conversationHistory = []) => {
  const systemPrompt = `Eres 'PolicIA', un asistente virtual experto diseñado exclusivamente para la Policía Nacional de Colombia.

Tus funciones son:
1. Interpretar el Código Nacional de Seguridad y Convivencia Ciudadana (Ley 1801 de 2016), el Código Penal Colombiano y el Código de Procedimiento Penal.
2. Guiar en procedimientos policiales paso a paso (capturas, incautaciones, comparendos).
3. Ayudar a redactar informes policiales claros y técnicos.

IMPORTANTE: Usa ÚNICAMENTE la información del contexto legal proporcionado para responder. Si la respuesta no está en el contexto, indícalo.

Contexto Legal Relevante:
${ragContext}

Tono: Profesional, autoritario pero respetuoso, técnico y conciso.
Formato: Usa listas numeradas para pasos, negrita para conceptos clave.

Si te preguntan algo fuera del contexto policial o legal, indica amablemente que solo puedes asistir en temas de servicio policial.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  return await chatCompletion(messages, { temperature: 0.3 });
};

/**
 * Generate document content using AI
 */
export const generateDocumentSection = async (prompt, context, formData) => {
  const systemPrompt = `Eres un experto redactor de documentos policiales para la Policía Nacional de Colombia.

Contexto Legal:
${context}

Datos del formulario:
${JSON.stringify(formData, null, 2)}

Instrucciones:
- Redacta en lenguaje técnico policial formal
- Usa tercera persona y tiempo pasado
- Sé preciso y conciso
- Cita artículos legales cuando corresponda
- No inventes información, usa solo los datos proporcionados`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ];

  return await chatCompletion(messages, { temperature: 0.2, maxTokens: 1500 });
};

export default {
  generateEmbedding,
  generateEmbeddings,
  chatCompletion,
  transcribeAudio,
  chatWithRAG,
  generateDocumentSection
};
