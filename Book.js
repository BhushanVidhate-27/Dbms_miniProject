const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Other'],
    default: 'Other'
  },
  totalCopies: {
    type: Number,
    required: true,
    min: [1, 'Must have at least 1 copy'],
    default: 1
  },
  availableCopies: {
    type: Number,
    min: 0
  },
  publishedYear: Number,
  publisher: String
}, { timestamps: true });

// Auto-set availableCopies to totalCopies on new book
bookSchema.pre('save', function (next) {
  if (this.isNew) this.availableCopies = this.totalCopies;
  next();
});

module.exports = mongoose.model('Book', bookSchema);
