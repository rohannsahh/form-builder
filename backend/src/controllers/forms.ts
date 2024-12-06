import { Request, Response } from 'express';
import Form from '../models/Form';
import { IForm } from '../types/form';
import FormResponse from '../models/FormResponse';

export const getForms = async (req: Request, res: Response): Promise<void> => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
};

export const updateForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request' });
  }
};

export const deleteForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// export const submitFormResponse = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const formResponse = new FormResponse({
//       formId: req.params.id,
//       responses: req.body
//     });
    
//     await formResponse.save();
//     res.status(201).json({ message: 'Response submitted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Bad Request' });
//   }
// };