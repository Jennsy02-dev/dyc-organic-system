import { Router } from 'express';
import { handleChat } from '../controllers/chatbot.controller.js';

const router = Router();

router.post('/chat', handleChat);

export default router;