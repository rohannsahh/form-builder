


import React, { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { CategorizeQuestion } from '../../types/form';
import { DndProvider } from './DndProvider';
import { DraggableItem } from './DraggableItem';
import { DroppableArea } from './DroppableArea';

interface Props {
  question: CategorizeQuestion;
  onChange: (answer: { [key: string]: string[] }) => void;
  value?: { [key: string]: string[] };
}

export const CategorizeRenderer: React.FC<Props> = ({
  question,
  onChange,
  value = {}
}) => {
  console.log('Question Prop:', question); // Logs the incoming question prop
  console.log('Value Prop:', value); // Logs the incoming value prop
  const [categorizedItems, setCategorizedItems] = useState<{
    [key: string]: string[];
  }>(value);

  // Get items that haven't been categorized yet
  const uncategorizedItems = question.items
    .map(item => item.text)
    .filter(item => !Object.values(categorizedItems).flat().includes(item));

  // Get all items for DndContext
  const allItems = [
    ...uncategorizedItems,
    ...Object.values(categorizedItems).flat()
  ];
  console.log('Uncategorized Items:', uncategorizedItems);
console.log('Categorized Items:', categorizedItems);
console.log('All Items:', allItems);


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const itemId = active.id as string;
    const container = (over.id as string).split('-')[0];

    // Remove item from its current category
    const newCategorizedItems = { ...categorizedItems };
    Object.keys(newCategorizedItems).forEach(cat => {
      newCategorizedItems[cat] = newCategorizedItems[cat]?.filter(
        item => item !== itemId
      );
    });

    // Add item to new category
    if (!newCategorizedItems[container]) {
      newCategorizedItems[container] = [];
    }
    newCategorizedItems[container].push(itemId);

    setCategorizedItems(newCategorizedItems);
    onChange(newCategorizedItems);
  };

  return (
    <div className="space-y-6">
      {question.description && (
        <p className="text-gray-600 mb-4">{question.description}</p>
      )}
      
      <DndProvider items={allItems} onDragEnd={handleDragEnd}>
        {/* Uncategorized items */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {uncategorizedItems.map((item) => (
              <DraggableItem
                key={item}
                id={item}
                text={item}
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 bg-red-500 gap-4">
          {question.categories.map((category, index) => (
            <DroppableArea
              key={category}
              id={category}
              title={category}
              items={categorizedItems[category] || []}
              bgColor={index % 2 === 0 ? 'bg-pink-100' : 'bg-yellow-100'}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};