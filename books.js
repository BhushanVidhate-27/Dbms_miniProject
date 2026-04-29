const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET all books
router.get('/', async (req, res) => {
  const { search, genre } = req.query;
  let query = {};
  if (search) query.$or = [
    { title: new RegExp(search, 'i') },
    { author: new RegExp(search, 'i') },
    { isbn: new RegExp(search, 'i') }
  ];
  if (genre) query.genre = genre;

  const books = await Book.find(query).sort({ createdAt: -1 });
  res.render('books/index', { books, search, genre });
});

// GET new book form
router.get('/new', (req, res) => res.render('books/new', { error: null }));

// POST create book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.redirect('/books');
  } catch (err) {
    res.render('books/new', { error: err.message });
  }
});

// GET single book
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.redirect('/books');
  res.render('books/show', { book });
});

// GET edit form
router.get('/:id/edit', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.redirect('/books');
  res.render('books/edit', { book, error: null });
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    res.redirect('/books');
  } catch (err) {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book, error: err.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/books');
});

module.exports = router;
