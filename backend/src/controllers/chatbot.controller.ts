import { Request, Response } from 'express';
import { getChatbotResponse } from '../services/chatbot.service.js';

export const handleChat = async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Debes enviar un historial de mensajes válido.' });
  }

  try {
    // Tomamos el último mensaje del usuario como la consulta actual
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || '';

    // Pasamos el resto de los mensajes como el historial previo
    const history = messages.slice(0, -1);

    // Llamamos al servicio con el nombre actualizado
    const reply = await getChatbotResponse(userMessage, history);

    return res.json({ success: true, reply });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};