import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/forms';
import { FormRenderer } from './renderer/FormRenderer';
import { Form } from '../types/form';

export const FormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await api.getForm(id!);
        setForm(response.data);
      } catch (err) {
        setError('Failed to load form');
        console.error('Error fetching form:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleSubmit = async (responses: any) => {
    try {
      // You'll need to create this endpoint in your backend
      await api.submitFormResponse(id!, responses);
      alert('Form submitted successfully!');
    } catch (err) {
      alert('Failed to submit form');
      console.error('Error submitting form:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'Form not found'}</div>
      </div>
    );
  }

  return <FormRenderer form={form} onSubmit={handleSubmit} />;
}; 