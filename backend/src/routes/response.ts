import express from 'express';
import { submitResponse, getFormResponses } from '../controllers/responses';

const router = express.Router();

router.post('/forms/:formId/responses', submitResponse);
router.get('/forms/:formId/responses', getFormResponses);

export default router;