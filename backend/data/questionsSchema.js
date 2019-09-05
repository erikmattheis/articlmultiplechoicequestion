/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  answers: [
    {
      answer: String,
      correct: Boolean,
      explanation: String
    }
  ],
  //  category: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  author: {
    _id: String,
    login: String
  },
  category: [
    {
      category_image: String,
      description: String,
      parent: Number,
      term_id: Number,
      title: { type: String }
    }
  ],
  createTime: Date,
  question: String,
  updated: Date
});

// { text: true, type: String },

questionSchema.index({ '$**': 'text' });

// can work
// questionSchema.index({
//   'answers.explanation': 'text',
//   'category.description': 'text',
//   'category.title': 'text'
// });

exports.Question = mongoose.model('Question', questionSchema);
