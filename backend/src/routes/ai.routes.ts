import { Router } from 'express';
import { handleHairDiagnosis } from '../controllers/ai.controller.js';

const router = Router();

// Cambiado de /diagnosis a /diagnostic
router.post('/diagnostic', handleHairDiagnosis);

export default router;