/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Form } from '../types/form';

 const API_URL = import.meta.env.VITE_BACKEND_URL; // deployement
;

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

