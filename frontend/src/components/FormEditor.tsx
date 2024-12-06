


import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon, Save } from 'lucide-react';
import { CategorizeQuestion, ClozeQuestion,ComprehensionQuestion, Form } from '../types/form';
import { api } from '../api/forms';
import QuestionEditor from './QuestionEditor';

const FormEditor: React.FC = () => {
  const [form, setForm] = useState<Form>({
    id: crypto.randomUUID(),
    title: 'Untitled Form',
    description: '',
    questions: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = (type: 'categorize' | 'cloze' | 'comprehension') => {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: crypto.randomUUID(),
        type,
        title: '',
        description: '',
          ...(type === 'categorize' 
            ? { type: 'categorize' as const, categories: [], items: [] } :
            type === 'cloze' 
            ? { type: 'cloze' as const, text: '', blanks: [] } :
            { type: 'comprehension' as const, passage: '', questions: [] })
      }]
    }));
  };

  const saveForm = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (form._id) {
        await api.updateForm(form._id, form);
      } else {
        const { data } = await api.createForm(form);
        setForm(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold w-full border-none focus:outline-none"
              placeholder="Form Title"
            />
          </div>
          <button
            onClick={saveForm}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <div className="mb-4">
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="Form Description"
          />
        </div>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ImageIcon size={20} />
          Add Header Image
        </button>
      </div>

      {form.questions.map((question, index) => (
        <QuestionEditor
          key={question.id}
          question={question}
          onChange={(updatedQuestion: CategorizeQuestion | ClozeQuestion | ComprehensionQuestion) => {  
            setForm(prev => ({
              ...prev,
              questions: prev.questions.map((q, i) =>
                i === index ? updatedQuestion : q
              )
            }));
          }}
          onDelete={() => {
            setForm(prev => ({
              ...prev,
              questions: prev.questions.filter((_, i) => i !== index)
            }));
          }}
        />
      ))}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => addQuestion('categorize')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusCircle size={20} />
          Categorize
        </button>
        <button
          onClick={() => addQuestion('cloze')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <PlusCircle size={20} />
          Cloze
        </button>
        <button
          onClick={() => addQuestion('comprehension')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          <PlusCircle size={20} />
          Comprehension
        </button>
      </div>
    </div>
  );
};

export default FormEditor;



