import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos la API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Inicializamos el modelo con las instrucciones del sistema para la asesora
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `
    Eres Yoly, la asesora virtual de "D' Y&C ORGANIC". 
    Tu objetivo es responder dudas sobre cosmética capilar orgánica, dar recomendaciones amables y personalizadas, 
    y ayudar a los clientes con información de nuestros productos 100% naturales. 
    Mantén un tono cálido, profesional y empático.
  `,
});

export const getChatbotResponse = async (userMessage: string, history: { role: string; content: string }[] = []) => {
  try {
    // Formateamos el historial al formato que espera Gemini SDK (user / model)
    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Iniciamos la sesión de chat con el historial
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error en el servicio del chatbot:', error);
    throw new Error('No se pudo procesar la respuesta de la asesora virtual.');
  }
};