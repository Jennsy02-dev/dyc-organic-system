/**
 * chatbot.routes.ts - Definición de rutas del Chatbot
 */

import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbot.controller.js';

const router = Router();

router.post('/message', ChatbotController.handleMessage);

export default router;