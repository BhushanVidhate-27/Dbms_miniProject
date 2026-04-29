const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  const { status } = req.query;
  let query = {};
  if (status) query.status = status;

  const issues = await Issue.find(query)
    .populate('book member')
    .sort({ issueDate: -1 });

  // Update overdue status
  for (let issue of issues) {
    if (issue.status === 'issued' && new Date(issue.dueDate) < new Date()) {
      issue.status = 'overdue';
      await issue.save();
    }
  }

  res.render('issues/index', { issues, status });
});

router.get('/new', async (req, res) => {
  const books = await Book.find({ availableCopies: { $gt: 0 } }).sort({ title: 1 });
  const members = await Member.find({ isActive: true }).sort({ name: 1 });
  res.render('issues/new', { books, members, error: null });
});

router.post('/', async (req, res) => {
  try {
    const { book: bookId, member: memberId, dueDate, remarks } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) throw new Error('Book not available');

    const issue = new Issue({ book: bookId, member: memberId, dueDate, remarks });
    await issue.save();

    book.availableCopies -= 1;
    await book.save();

    res.redirect('/issues');
  } catch (err) {
    const books = await Book.find({ availableCopies: { $gt: 0 } });
    const members = await Member.find({ isActive: true });
    res.render('issues/new', { books, members, error: err.message });
  }
});

// Return a book
router.post('/:id/return', async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue || issue.status === 'returned') return res.redirect('/issues');

  const returnDate = new Date();
  const dueDate = new Date(issue.dueDate);
  let fine = 0;
  if (returnDate > dueDate) {
    const overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
    fine = overdueDays * 5; // ₹5 per day
  }

  issue.returnDate = returnDate;
  issue.status = 'returned';
  issue.fine = fine;
  await issue.save();

  await Book.findByIdAndUpdate(issue.book, { $inc: { availableCopies: 1 } });
  res.redirect('/issues');
});

router.delete('/:id', async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (issue && issue.status !== 'returned') {
    await Book.findByIdAndUpdate(issue.book, { $inc: { availableCopies: 1 } });
  }
  await Issue.findByIdAndDelete(req.params.id);
  res.redirect('/issues');
});

module.exports = router;
