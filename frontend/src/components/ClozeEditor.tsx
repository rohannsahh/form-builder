/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ImageIcon,Plus } from "lucide-react";
interface Blank {
  id: string
  word: string
}

interface Option {
  id: string
  text: string
}

interface ClozeEditorProps {
  question: {
    text: string;
    blanks: Array<{
      word: string;
      index: number;
    }>;
  };
  onChange: (question: any) => void;
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center space-x-2 bg-white p-2 rounded shadow-md"
    >
      {children}
    </div>
  )
}

export default function ClozeQuestionBuilder({ question, onChange }: ClozeEditorProps) {
  const [description, setDescription] = useState("")
  const [sentence, setSentence] = useState("")
  const [blanks, setBlanks] = useState<Blank[]>([])
  const [options, setOptions] = useState<Option[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [points, setPoints] = useState<number>(0)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleSelection = useCallback(() => {
    if (!textRef.current) return
    const start = textRef.current.selectionStart
    const end = textRef.current.selectionEnd
    const selectedText = sentence.substring(start, end).trim()

    if (selectedText && !blanks.some((blank) => blank.word === selectedText)) {
      const newBlank: Blank = {
        id: `blank-${blanks.length + 1}`,
        word: selectedText,
      }
      setBlanks((prevBlanks) => [...prevBlanks, newBlank])
      setOptions((prevOptions) => [
        ...prevOptions,
        { id: `option-${options.length + 1}`, text: selectedText },
      ])

      const before = sentence.substring(0, start)
      const after = sentence.substring(end)
      setSentence(`${before}[${selectedText}]${after}`)
    }
  }, [sentence, blanks, options])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const addOption = () => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { id: `option-${prevOptions.length + 1}`, text: "" },
    ])
  }

  const updateOption = (id: string, text: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, text } : option
      )
    )
  }

  const removeOption = (id: string) => {
    setOptions((prevOptions) =>
      prevOptions.filter((option) => option.id !== id)
    )
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const renderPreview = () => {
    let previewText = sentence
    blanks.forEach((blank, index) => {
      const blankPlaceholder = `[Blank ${index + 1}]`
      previewText = previewText.replace(`[${blank.word}]`, blankPlaceholder)
    })

    return (
      <div className="mt-4 p-4 border rounded-md bg-gray-50">
        <h3 className="font-semibold mb-2">Preview:</h3>
        <p>{previewText}</p>
        {/* {blanks.map((blank, index) => (
          <div key={blank.id} className="mt-2">
            <span className="font-medium">Blank {index + 1}: </span>
            <select className="ml-2 p-1 border rounded">
              {options.map((option) => (
                <option key={option.id} value={option.text}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        ))} */}
      </div>
    )
  }

  return (
    <div className="w-full mx-auto bg-white p-6 m-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Cloze Question Builder</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="points" className="text-sm font-medium">
            Points:
          </label>
          <input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-16 h-8 p-1 text-sm border rounded"
          />
        </div>
      </div>

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

      {renderPreview()}

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sentence</label>
        <textarea
          ref={textRef}
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          className="w-full p-2 border rounded min-h-[100px]"
          placeholder="Enter your sentence here. Select words to convert them into blanks."
        />
        <p className="text-sm text-gray-500">
          Select words to convert them into blanks
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Blanks and Options
        </label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={options.map((option) => option.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4 p-4  border rounded-md bg-white">
              {options.map((option) => (
                <SortableItem key={option.id} id={option.id}>
                  <div className="flex items-center space-x-2">
                    <span className="cursor-move">☰</span>
                    <input
                      value={option.text}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      placeholder={`Option ${option.id.split("-")[1]}`}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </div>
                </SortableItem>
              ))}
              </div>
              <button 
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={addOption}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </button>
           
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
