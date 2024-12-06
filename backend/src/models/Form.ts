import mongoose, { Schema } from 'mongoose';
import { IForm } from '../types/form';

const questionSchema = new Schema({
  id: String,
  type: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension'],
    required: true
  },
  title: String,
  description: String,
  imageUrl: String,
  
  // Categorize specific fields
  categories: [String],
  items: [{
    text: String,
    category: String
  }],
  
  // Cloze specific fields
  text: String,
  blanks: [{
    word: String,
    index: Number
  }],
  
  // Comprehension specific fields
  passage: String,
  questions: [{
    text: String,
    options: [String],
    correctAnswer: Number
  }]
});

const formSchema = new Schema<IForm>({
  title: {
    type: String,
    required: true
  },
  description: String,
  headerImage: String,
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IForm>('Form', formSchema);