import express from 'express';
import { getForms, getForm, createForm, updateForm, deleteForm,  } from '../controllers/forms';

const router = express.Router();

router.get('/', getForms);
router.get('/:id', getForm);
router.post('/', createForm);
router.put('/:id', updateForm);
router.delete('/:id', deleteForm);
// router.post('/:id/responses', submitFormResponse);

export default router;