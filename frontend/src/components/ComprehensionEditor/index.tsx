import React, { useState } from 'react';
import { ImageIcon, Plus } from 'lucide-react';
import { ComprehensionQuestion } from '../../types/form';
import { MCQQuestion } from './MCQQuestion';

interface ComprehensionEditorProps {
  question: ComprehensionQuestion;
  onChange: (question: ComprehensionQuestion) => void;
}

export const ComprehensionEditor: React.FC<ComprehensionEditorProps> = ({
  question,
  onChange,
}) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      onChange({ ...question, imageUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const addMCQQuestion = () => {
    onChange({
      ...question,
      questions: [
        ...question.questions,
        {
          text: '',
          options: ['', ''],
          correctAnswer: 0,
        },
      ],
    });
  };

  const updateQuestion = (index: number, updates: Partial<ComprehensionQuestion['questions'][0]>) => {
    const newQuestions = [...question.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange({ ...question, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    onChange({
      ...question,
      questions: question.questions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter question description..." 
          value={question.description || ''}
          onChange={(e) => onChange({ ...question, description: e.target.value })}
          rows={4}
        />
        <div className="flex items-center space-x-2">
          <button 
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Image
          </button>
          <input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
          {image && <span className="text-sm text-gray-500">{image.name}</span>}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Passage</label>
        <textarea
          value={question.passage}
          onChange={(e) => onChange({ ...question, passage: e.target.value })}
          placeholder="Enter the comprehension passage..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Questions</h3>
          <button
            onClick={addMCQQuestion}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add MCQ Question
          </button>
        </div>

        <div className="space-y-4">
          {question.questions.map((mcq, index) => (
            <MCQQuestion
              key={index}
              questionText={mcq.text}
              options={mcq.options}
              correctAnswer={mcq.correctAnswer}
              onQuestionChange={(text) => updateQuestion(index, { text })}
              onOptionsChange={(options) => updateQuestion(index, { options })}
              onCorrectAnswerChange={(correctAnswer) => updateQuestion(index, { correctAnswer })}
              onDelete={() => removeQuestion(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};