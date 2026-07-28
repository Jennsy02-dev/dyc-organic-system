/**
 * chatbot.controller.ts - Manejo de peticiones HTTP del Chatbot
 */

import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbot.service.js';

export class ChatbotController {
  public static async handleMessage(req: Request, res: Response): Promise<Response> {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'El mensaje es requerido y debe ser un texto.' });
      }

      const reply = await ChatbotService.processMessage(message);

      return res.json({ reply });
    } catch (error) {
      console.error('Error en ChatbotController:', error);
      return res.status(500).json({ error: 'Ocurrió un error al procesar tu mensaje.' });
    }
  }
}