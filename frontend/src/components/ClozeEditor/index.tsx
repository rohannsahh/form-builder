import React, { useState, useEffect } from 'react';
import { ImageIcon, X, GripVertical, Plus } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ClozeQuestion } from '../../types/form';
import { SortableItem } from './SortableItem';
import { Preview } from './Preview';

interface ClozeEditorProps {
  question: ClozeQuestion;
  onChange: (question: ClozeQuestion) => void;
}

export const ClozeEditor: React.FC<ClozeEditorProps> = ({ question, onChange }) => {
  const [description, setDescription] = useState(question.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const blankWords = question.blanks.map(blank => blank.word);
    const uniqueWords = Array.from(new Set(blankWords));
    setOptions(uniqueWords);
  }, [question.blanks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      onChange({ ...question, imageUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const addBlank = () => {
    if (!selectedText || !question.text) return;

    const start = question.text.indexOf(selectedText);
    if (start === -1) return;

    const newBlanks = [...question.blanks];
    const blankExists = newBlanks.some(
      blank => blank.index === start && blank.word === selectedText
    );

    if (!blankExists) {
      newBlanks.push({
        word: selectedText,
        index: start
      });
      newBlanks.sort((a, b) => a.index - b.index);
      onChange({ ...question, blanks: newBlanks });
      
      if (!options.includes(selectedText)) {
        setOptions([...options, selectedText]);
      }
    }

    setSelectedText("");
  };

  const removeBlank = (index: number) => {
    const removedBlank = question.blanks[index];
    onChange({
      ...question,
      blanks: question.blanks.filter((_, i) => i !== index)
    });

    const isWordUsedElsewhere = question.blanks.some(
      (blank, i) => i !== index && blank.word === removedBlank.word
    );
    if (!isWordUsedElsewhere) {
      setOptions(options.filter(opt => opt !== removedBlank.word));
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOptions(items => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const addOption = (option: string) => {
    if (option.trim() && !options.includes(option.trim())) {
      setOptions([...options, option.trim()]);
    }
  };

  const removeOption = (option: string) => {
    setOptions(options.filter(opt => opt !== option));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onChange({ ...question, description: e.target.value });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter question description..." 
            value={description}
            onChange={handleDescriptionChange}
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
          <h3 className="font-medium text-gray-700">Preview</h3>
          <Preview text={question.text} blanks={question.blanks} />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Text Content
          </label>
          <textarea
            value={question.text}
            onChange={(e) => onChange({ ...question, text: e.target.value })}
            onMouseUp={handleTextSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your text here and select words to create blanks..."
            rows={4}
          />
          {selectedText && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Selected: "{selectedText}"
              </span>
              <button
                onClick={addBlank}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Make Blank
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Options</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new option..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    addOption((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add new option..."]') as HTMLInputElement;
                  if (input.value) {
                    addOption(input.value);
                    input.value = '';
                  }
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={options} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {options.map((option) => (
                  <SortableItem key={option} id={option}>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <span className="flex-1">{option}</span>
                      <button
                        onClick={() => removeOption(option)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};