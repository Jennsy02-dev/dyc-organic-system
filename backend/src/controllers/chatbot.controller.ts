import { Request, Response } from 'express';
import { chatWithBot } from '../services/chatbot.service.js';

export const handleChat = async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Debes enviar un historial de mensajes válido.' });
  }

  try {
    const reply = await chatWithBot(messages);
    return res.json({ success: true, reply });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};