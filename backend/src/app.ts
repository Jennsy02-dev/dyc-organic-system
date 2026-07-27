import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba de la API
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: "API de D' Y&C ORGANIC funcionando correctamente" });
});

export default app;