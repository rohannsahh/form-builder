import React from 'react';
import { DraggableItem } from './DraggableItem';

interface DroppableAreaProps {
  id: string;
  title: string;
  items: string[];
  bgColor?: string;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({ 
  id, 
  title, 
  items, 
  bgColor = 'bg-pink-100' 
}) => {
  return (
    <div 
      className={`${bgColor} p-4 rounded-lg min-h-[100px] flex flex-col gap-2`}
      data-category={id}
    >
      <div className="font-medium text-gray-700 mb-2">{title}</div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <DraggableItem key={item} id={item} text={item} />
        ))}
      </div>
    </div>
  );
};