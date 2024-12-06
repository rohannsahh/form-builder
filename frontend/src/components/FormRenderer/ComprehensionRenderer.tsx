import React, { useState } from 'react';
import { ComprehensionQuestion } from '../../types/form';

interface Props {
  question: ComprehensionQuestion;
  onChange: (answer: number[]) => void;
  value?: number[];
}

export const ComprehensionRenderer: React.FC<Props> = ({
  question,
  onChange,
  value = []
}) => {
  const [answers, setAnswers] = useState<number[]>(value);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      {question.description && (
        <p className="text-gray-600">{question.description}</p>
      )}

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {question.passage}
        </p>
      </div>

      <div className="space-y-6">
        {question.questions.map((mcq, index) => (
          <div key={index} className="space-y-3">
            <p className="font-medium">{mcq.text}</p>
            <div className="space-y-2">
              {mcq.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    checked={answers[index] === optionIndex}
                    onChange={() => handleAnswerChange(index, optionIndex)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};