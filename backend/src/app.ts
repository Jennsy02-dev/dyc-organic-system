import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);

// Ruta de prueba
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: "API de D' Y&C ORGANIC funcionando correctamente" });
});

export default app;