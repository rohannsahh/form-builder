import { useState, useEffect } from "react"
import { X, GripVertical, Plus, ImageIcon } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CategorizeQuestion } from '../types/form'

interface Category {
  id: string
  name: string
}

interface Item {
  id: string
  text: string
  belongsTo: string
}

interface CategorizeEditorProps {
  question: CategorizeQuestion;
  onChange: (question: CategorizeQuestion) => void;
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export const CategorizeEditor: React.FC<CategorizeEditorProps> = ({ question, onChange }) => {
  const [categories, setCategories] = useState<Category[]>(
    question.categories.map((name, index) => ({ id: index.toString(), name }))
  );
  const [items, setItems] = useState<Item[]>(
    question.items.map((item, index) => ({ 
      id: index.toString(), 
      text: item.text, 
      belongsTo: item.category 
    }))
  );
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    onChange({
      ...question,
      categories: categories.map(c => c.name),
      items: items.map(item => ({
        text: item.text,
        category: item.belongsTo
      }))
    });
    
  }, [categories, items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addCategory = () => {
    const newId = (categories.length + 1).toString()
    setCategories([...categories, { id: newId, name: "" }])
  }

  const addItem = () => {
    const newId = (items.length + 1).toString()
    setItems([...items, { id: newId, text: "", belongsTo: "" }])
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateCategory = (id: string, name: string) => {
    setCategories(
      categories.map(category =>
        category.id === id ? { ...category, name } : category
      )
    )
  }

  const updateItem = (id: string, text: string, belongsTo?: string) => {
    setItems(
      items.map(item =>
        item.id === id
          ? { ...item, text, ...(belongsTo && { belongsTo }) }
          : item
      )
    )
  }

  const handleDragEnd = (event: any, listType: 'categories' | 'items') => {
    const { active, over } = event

    if (active.id !== over.id) {
      if (listType === 'categories') {
        setCategories((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)
          return arrayMove(items, oldIndex, newIndex)
        })
      } else {
        setItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)
          return arrayMove(items, oldIndex, newIndex)
        })
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 space-y-6">
        <div className="space-y-4 ">
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
         <div className="flex space-x-2">
            <textarea 
            className="w-full p-2   border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter question description..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <div className="">
            <div 
              className="inline-flex items-center px-2 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <ImageIcon className="h-4 w-4 " />
              
            </div>
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={addCategory}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'categories')}>
            <SortableContext items={categories.map(cat => cat.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {categories.map((category) => (
                  <SortableItem key={category.id} id={category.id}>
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <input
                        type="text"
                        placeholder={`Category ${category.id}`}
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeCategory(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={addItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'items')}>
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id}>
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <input
                        type="text"
                        placeholder={`Item ${item.id}`}
                        value={item.text}
                        onChange={(e) => updateItem(item.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={item.belongsTo}
                        onChange={(e) => updateItem(item.id, item.text, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Belongs to...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name || `Category ${category.id}`}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
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
  )
}

export default CategorizeEditor;