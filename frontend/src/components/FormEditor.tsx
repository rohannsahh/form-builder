import React, { useState } from 'react';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import { Form } from '../types/form';
import QuestionEditor from './QuestionEditor';

const FormEditor: React.FC = () => {
  const [form, setForm] = useState<Form>({
    id: crypto.randomUUID(),
    title: 'Untitled Form',
    description: '',
    questions: []
  });

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="text-2xl font-bold w-full border-none focus:outline-none"
            placeholder="Form Title"
          />
        </div>
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
          onChange={(updatedQuestion) => {
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