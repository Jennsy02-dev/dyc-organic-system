import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('Error al consultar la IA:', error);
    throw new Error('No se pudo generar el diagnóstico capilar.');
  }
};