import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface DndProviderProps {
  children: React.ReactNode;
  items: string[];
  onDragEnd: (event: DragEndEvent) => void;
}

export const DndProvider: React.FC<DndProviderProps> = ({ children, items, onDragEnd }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  console.log('All Items passed to DndProvider:', items);
  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};