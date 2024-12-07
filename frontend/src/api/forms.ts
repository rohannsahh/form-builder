/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Form } from '../types/form';

// const API_URL = process.env.BACKEND_URL; deployement
const API_URL ='http://localhost:5000/api';

 export const api = {
   getForms: () => 
     axios.get<Form[]>(`${API_URL}/forms`),
  
  getForm: (id: string) =>
    axios.get<Form>(`${API_URL}/forms/${id}`),
  
  createForm: (form: Omit<Form, '_id'>) =>
    axios.post<Form>(`${API_URL}/forms`, form),
  
  updateForm: (id: string, form: Form) =>
    axios.put<Form>(`${API_URL}/forms/${id}`, form),
  
  deleteForm: (id: string) =>
    axios.delete(`${API_URL}/forms/${id}`),

  submitResponse: (formId: string, responses: any) =>
     axios.post(`${API_URL}/forms/${formId}/responses`, responses),
 };

