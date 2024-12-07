import React from 'react';
import { X, Plus } from 'lucide-react';

interface MCQQuestionProps {
  questionText: string;
  options: string[];
  correctAnswer: number;
  onQuestionChange: (text: string) => void;
  onOptionsChange: (options: string[]) => void;
  onCorrectAnswerChange: (index: number) => void;
  onDelete: () => void;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  questionText,
  options,
  correctAnswer,
  onQuestionChange,
  onOptionsChange,
  onCorrectAnswerChange,
  onDelete,
}) => {
  const addOption = () => {
    onOptionsChange([...options, '']);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onOptionsChange(newOptions);
    if (correctAnswer === index) {
      onCorrectAnswerChange(0);
    } else if (correctAnswer > index) {
      onCorrectAnswerChange(correctAnswer - 1);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-start justify-between gap-4">
        <textarea
          value={questionText}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Enter your question"
          className="flex-1 p-2 border rounded-md min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          title="Delete question"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              title="Select correct answer"
              type="radio"
              checked={correctAnswer === index}
              onChange={() => onCorrectAnswerChange(index)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <input
              title={`Edit option ${index + 1}`}
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              title="Remove option"
              onClick={() => removeOption(index)}
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addOption}
        title="Add new option"
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Option
      </button>
    </div>
  );
};