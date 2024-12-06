import { Request, Response } from 'express';
import ResponseModel from '../models/FormResponse';

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const response = new ResponseModel({
      formId,
      answers: req.body.answers
    });
    
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Failed to submit response' 
    });
  }
};

export const getFormResponses = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const responses = await ResponseModel.find({ formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to get responses' 
    });
  }
};