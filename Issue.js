const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued'
  },
  fine: {
    type: Number,
    default: 0
  },
  remarks: String
}, { timestamps: true });

// Auto-set dueDate to 14 days if not provided
issueSchema.pre('save', function (next) {
  if (this.isNew && !this.dueDate) {
    const due = new Date();
    due.setDate(due.getDate() + 14);
    this.dueDate = due;
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
