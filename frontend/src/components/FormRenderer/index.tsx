import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/forms';
import { Form } from '../../types/form';
import { CategorizeRenderer } from './CategorizeRenderer';
import { ClozeRenderer } from './ClozeRenderer';
import { ComprehensionRenderer } from './ComprehensionRenderer';

const FormRenderer = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      if (!formId) throw new Error('Form ID is required');
      const response = await api.getForm(formId);
      setForm(response.data);
    } catch (err) {
      setError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form?._id) return;
      
      await api.submitResponse(form._id, {
        formId: form._id,
        answers
      });
      
      navigate('/');
    } catch (err) {
      setError('Failed to submit form');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !form) {
    return <div className="text-red-500 text-center py-8">{error || 'Form not found'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 mb-4">{form.description}</p>
        )}
        {form.headerImage && (
          <img
            src={form.headerImage}
            alt="Form header"
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
        )}
      </div>

      <div className="space-y-6">
        {form.questions.map((question, index) => {
          const commonProps = {
            question,
            onChange: (answer: any) => handleAnswer(question.id, answer),
            value: answers[question.id]
          };

          return (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Question {index + 1}</h3>
                {question.title && (
                  <p className="text-gray-600">{question.title}</p>
                )}
              </div>

              {question.type === 'categorize' && (
                <CategorizeRenderer {...commonProps} />
              )}
              {question.type === 'cloze' && (
                <ClozeRenderer {...commonProps} />
              )}
              {question.type === 'comprehension' && (
                <ComprehensionRenderer {...commonProps} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormRenderer;