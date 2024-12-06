// import mongoose, { Schema } from 'mongoose';

// const formResponseSchema = new Schema({
//   formId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Form',
//     required: true
//   },
//   responses: {
//     type: Schema.Types.Mixed,
//     required: true
//   },
//   submittedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.model('FormResponse', formResponseSchema); 


import mongoose, { Schema } from 'mongoose';

const responseSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  answers: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Response', responseSchema);