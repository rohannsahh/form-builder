
import React from 'react';
import { Trash2 } from 'lucide-react';
import {  CategorizeQuestion, ClozeQuestion, ComprehensionQuestion } from '../../types/form';
import { CategorizeEditor } from './CategorizeEditor';
import { ClozeEditor } from './ClozeEditor';
import { ComprehensionEditor } from '././ComprehensionEditor';



export interface QuestionEditorProps {
  question: CategorizeQuestion | ClozeQuestion | ComprehensionQuestion;
  onChange: (updatedQuestion: CategorizeQuestion | ClozeQuestion | ComprehensionQuestion) => void;
  onDelete: () => void;
}


const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onDelete
}) => {
  const renderEditor = () => {
    switch (question.type) {
      case 'categorize':
        return <CategorizeEditor question={question as CategorizeQuestion} onChange={onChange} />;
      case 'cloze':
        return <ClozeEditor question={question as ClozeQuestion} onChange={onChange} />;
      case 'comprehension':
        return <ComprehensionEditor question={question as ComprehensionQuestion} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={question.title}
          onChange={(e) => onChange({ ...question, title: e.target.value })}
          className="text-xl font-semibold w-full mr-4 border-none focus:outline-none"
          placeholder="Question Title"
        />
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete question"
        >
          <Trash2 size={20} />
        </button>
      </div>
      {renderEditor()}
    </div>
  );
};

export default QuestionEditor;



