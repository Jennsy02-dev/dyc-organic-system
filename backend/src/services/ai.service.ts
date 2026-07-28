import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos el SDK oficial con la API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Obtenemos el modelo
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const generateHairDiagnosis = async (hairType: string, scalpCondition: string, mainProblem: string) => {
  try {
    const prompt = `
      Actúa como un experto dermotricólogo y especialista en cosmética orgánica para la marca "D' Y&C ORGANIC".
      
      Analiza los siguientes datos del cliente:
      - Tipo de cabello: ${hairType}
      - Condición del cuero cabelludo: ${scalpCondition}
      - Problema principal: ${mainProblem}
      
      Genera una rutina capilar recomendada usando productos 100% orgánicos.
    `;

    // Con el SDK oficial se llama a generateContent directamente sobre la instancia del modelo
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error al consultar la IA:', error);
    throw new Error('No se pudo generar el diagnóstico capilar.');
  }
};