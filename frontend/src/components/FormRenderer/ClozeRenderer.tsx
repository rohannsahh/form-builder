import React, { useState } from 'react';
import { ClozeQuestion } from '../../types/form';

interface Props {
  question: ClozeQuestion;
  onChange: (answer: string[]) => void;
  value?: string[];
}

export const ClozeRenderer: React.FC<Props> = ({
  question,
  onChange,
  value = []
}) => {
  const [answers, setAnswers] = useState<string[]>(value);

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const renderText = () => {
    let result = question.text;
    const sortedBlanks = [...question.blanks].sort((a, b) => b.index - a.index);

    sortedBlanks.forEach((blank, index) => {
      const input = (
        <input
          type="text"
          value={answers[index] || ''}
          onChange={(e) => handleAnswerChange(index, e.target.value)}
          className="mx-1 w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );

      result = (
        result.slice(0, blank.index) +
        `[BLANK_${index}]` +
        result.slice(blank.index + blank.word.length)
      );
    });

    return result.split(/\[BLANK_\d+\]/).map((text, i) => (
      <React.Fragment key={i}>
        {text}
        {i < sortedBlanks.length && (
          <input
            type="text"
            value={answers[i] || ''}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            className="mx-1 w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-4">
      {question.description && (
        <p className="text-gray-600 mb-4">{question.description}</p>
      )}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-lg leading-relaxed">{renderText()}</p>
      </div>
    </div>
  );
};