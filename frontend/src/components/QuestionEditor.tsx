// import React, { useRef, useState } from 'react';
// import { ClozeQuestion } from '../types/form';

// interface ClozeEditorProps {
//   question: ClozeQuestion;
//   onChange: (question: ClozeQuestion) => void;
// }

// export const ClozeEditor: React.FC<ClozeEditorProps> = ({ question, onChange }) => {
//   const [selectedText, setSelectedText] = useState('');
//   const textRef = useRef<HTMLTextAreaElement>(null);

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     onChange({ ...question, text: e.target.value, blanks: [] });
//   };

//   const handleTextSelect = () => {
//     if (textRef.current) {
//       const selection = textRef.current.value.substring(
//         textRef.current.selectionStart,
//         textRef.current.selectionEnd
//       );
//       if (selection) {
//         setSelectedText(selection);
//       }
//     }
//   };

//   const createBlank = () => {
//     if (!selectedText || !textRef.current) return;

//     const start = textRef.current.value.indexOf(selectedText);
//     if (start === -1) return;

//     const newBlanks = [...question.blanks];
//     const blankExists = newBlanks.some(
//       blank => blank.index === start && blank.word === selectedText
//     );

//     if (!blankExists) {
//       newBlanks.push({
//         word: selectedText,
//         index: start
//       });
//       newBlanks.sort((a, b) => a.index - b.index);
//       onChange({ ...question, blanks: newBlanks });
//     }

//     setSelectedText('');
//   };

//   const removeBlank = (index: number) => {
//     onChange({
//       ...question,
//       blanks: question.blanks.filter((_, i) => i !== index)
//     });
//   };

//   const renderPreview = () => {
//     let text = question.text;
//     const blanks = [...question.blanks].sort((a, b) => b.index - a.index);
    
//     blanks.forEach(blank => {
//       text = text.slice(0, blank.index) + '_'.repeat(blank.word.length) + text.slice(blank.index + blank.word.length);
//     });

//     return text;
//   };

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <label className="block font-medium text-gray-700">
//           Text Content
//         </label>
//         <textarea
//           ref={textRef}
//           value={question.text}
//           onChange={handleTextChange}
//           onMouseUp={handleTextSelect}
//           className="w-full px-3 py-2 border rounded-md min-h-[100px]"
//           placeholder="Enter your text here..."
//         />
//       </div>

//       {selectedText && (
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-600">
//             Selected text: "{selectedText}"
//           </span>
//           <button
//             onClick={createBlank}
//             className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Make Blank
//           </button>
//         </div>
//       )}

//       <div className="space-y-2">
//         <h3 className="font-medium text-gray-700">Blanks</h3>
//         <div className="space-y-2">
//           {question.blanks.map((blank, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-2 bg-gray-50 p-2 rounded-md"
//             >
//               <span className="flex-1">"{blank.word}"</span>
//               <button
//                 onClick={() => removeBlank(index)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <h3 className="font-medium text-gray-700">Preview</h3>
//         <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
//           {renderPreview()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClozeEditor;

import React from 'react';
import  ClozeEditor  from './ClozeEditor';
import { CategorizeEditor } from './CategorizeEditor';
import { ClozeQuestion, CategorizeQuestion } from '../types/form';
import { Trash } from 'lucide-react';

interface QuestionEditorProps {
  question: ClozeQuestion | CategorizeQuestion;
  onChange: (question: ClozeQuestion | CategorizeQuestion) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onChange, onDelete }) => {
  return (
    <div className="flex space-x-3">
      {question.type === 'cloze' && (
        <ClozeEditor question={question} onChange={onChange} />
      )}
      {question.type === 'categorize' && (
        <CategorizeEditor question={question} onChange={onChange} />
      )}
      <div onClick={onDelete} className="">
        <Trash/>
      </div>
    </div>
  );
};

export default QuestionEditor;