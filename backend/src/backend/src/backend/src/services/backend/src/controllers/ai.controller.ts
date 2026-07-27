import { Request, Response } from 'express';
import { generateHairDiagnosis } from '../services/ai.service.js';

export const handleHairDiagnosis = async (req: Request, res: Response) => {
  const { hairType, scalpCondition, mainProblem } = req.body;

  if (!hairType || !scalpCondition || !mainProblem) {
    return res.status(400).json({ error: 'Faltan datos requeridos para el análisis.' });
  }

  try {
    const result = await generateHairDiagnosis(hairType, scalpCondition, mainProblem);
    return res.json({ success: true, diagnosis: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};