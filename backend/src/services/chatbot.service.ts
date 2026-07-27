import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `
Eres "Yoly", la asistente virtual experta de la marca "D' Y&C ORGANIC".
Tu misión es brindar atención al cliente, asesoría capilar personalizada y recomendar los productos orgánicos de la marca.

Información clave de D' Y&C ORGANIC:
- Vendemos productos 100% orgánicos y libres de químicos agresivos (champús, acondicionadores, mascarillas, aceites, tónicos).
- Ingredientes estrella: Romero, Jengibre, Keratina Vegetal, Aceite de Argán, Cebolla Morada, Sábila.
- Atendemos casos de: Caída del cabello, caspa, cuero cabelludo graso/seco, crecimiento, brillo y restauración post-químicos.
- Tono de voz: Amable, empático, profesional, fresco y caribeño. Usa emojis ocasionalmente de forma natural.

Reglas del Chatbot:
1. Si el cliente pregunta por productos o rutina, recomiéndale consultar su tipo de cabello o hazle preguntas breves para guiarlo.
2. Mantén las respuestas concisas (máximo 2 a 3 párrafos cortos) para que la conversación sea fluida en la ventana de chat.
`;

export const chatWithBot = async (messages: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
        ...messages
      ]
    });

    return response.text;
  } catch (error: any) {
    console.error('Error en el servicio del Chatbot:', error);
    throw new Error('Ocurrió un error al procesar el mensaje con la IA.');
  }
};