import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generatePoliceResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[] = []
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // Construct the chat history for context
    // We limit history to last 10 messages to save context window and keep it relevant
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // System instruction to guide the persona
    const systemInstruction = `
      Actúa como 'PolicIA', un asistente virtual experto diseñado exclusivamente para la Policía Nacional de Colombia.
      
      Tus funciones son:
      1. Interpretar el Código Nacional de Seguridad y Convivencia Ciudadana (Ley 1801 de 2016) y el Código Penal.
      2. Guiar en procedimientos policiales paso a paso (capturas, incautaciones, comparendos).
      3. Ayudar a redactar informes policiales claros y técnicos.
      
      Tono: Profesional, autoritario pero respetuoso, técnico y conciso.
      Formato: Usa listas numeradas para pasos, negrita para conceptos clave.
      
      Si te preguntan algo fuera del contexto policial o legal, indica amablemente que solo puedes asistir en temas de servicio policial.
    `;

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Keep it factual
      },
      history: recentHistory
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "Lo siento, no pude generar una respuesta en este momento.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error de conexión con el servicio central. Por favor intente nuevamente.";
  }
};