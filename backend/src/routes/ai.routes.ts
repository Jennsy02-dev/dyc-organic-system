import { Router } from 'express';
import { handleHairDiagnosis } from '../controllers/ai.controller.js';

const router = Router();

router.post('/diagnosis', handleHairDiagnosis);

export default router;