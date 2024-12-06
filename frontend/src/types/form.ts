// export interface Question {
//     id: string;
//     type: 'categorize' | 'cloze' | 'comprehension';
//     title: string;
//     description?: string;
//     imageUrl?: string;
//   }
  
//   export interface CategorizeQuestion extends Question {
//     type: 'categorize';
//     categories: string[];
//     items: {
//       text: string;
//       category: string;
//     }[];
//   }
  
//   export interface ClozeQuestion extends Question {
//     type: 'cloze';
//     text: string;
//     blanks: {
//       word: string;
//       index: number;
//     }[];
//   }
  
//   export interface ComprehensionQuestion extends Question {
//     type: 'comprehension';
//     passage: string;
//     questions: {
//       text: string;
//       options: string[];
//       correctAnswer: number;
//     }[];
//   }
  
//   export interface Form {
//     id: string;
//     title: string;
//     description: string;
//     headerImage?: string;
//     questions: (CategorizeQuestion | ClozeQuestion | ComprehensionQuestion)[];
//   }





  export interface Question {
    id: string;
    type: 'categorize' | 'cloze' | 'comprehension';
    title: string;
    description?: string;
    imageUrl?: string;
  }
  
  export interface CategorizeQuestion extends Question {
    type: 'categorize';
    categories: string[];
    items: {
      text: string;
      category: string;
    }[];
  }
  
  export interface ClozeQuestion extends Question {
    type: 'cloze';
    text: string;
    blanks: {
      word: string;
      index: number;
    }[];
  }
  
  export interface ComprehensionQuestion extends Question {
    type: 'comprehension';
    passage: string;
    questions: {
      text: string;
      options: string[];
      correctAnswer: number;
    }[];
  }
  
  export interface Form {
    _id?: string;
    id: string;
    title: string;
    description: string;
    headerImage?: string;
    questions: (CategorizeQuestion | ClozeQuestion | ComprehensionQuestion)[];
    createdAt?: Date;
  }