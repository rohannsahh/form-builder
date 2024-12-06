import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableItemProps {
  id: string;
  text: string;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ id, text }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-purple-500 text-white rounded-md shadow-sm cursor-move hover:bg-purple-600 transition-colors"
    >
      {text}
    </div>
  );
};