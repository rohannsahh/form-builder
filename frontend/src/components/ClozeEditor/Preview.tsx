import React from 'react';

interface PreviewProps {
  text: string;
  blanks: Array<{ word: string; index: number }>;
}

export const Preview: React.FC<PreviewProps> = ({ text, blanks }) => {
  const renderPreview = () => {
    if (!text) return '';
    
    let result = text;
    const sortedBlanks = [...blanks].sort((a, b) => b.index - a.index);
    
    sortedBlanks.forEach(blank => {
      const blankDisplay = '_'.repeat(blank.word.length);
      result = result.slice(0, blank.index) + blankDisplay + result.slice(blank.index + blank.word.length);
    });

    return result;
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <p className="whitespace-pre-wrap font-mono">{renderPreview()}</p>
    </div>
  );
};