require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const issueRoutes = require('./routes/issues');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected to library_db'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', async (req, res) => {
  const Book = require('./models/Book');
  const Member = require('./models/Member');
  const Issue = require('./models/Issue');

  const [totalBooks, totalMembers, activeIssues, overdueIssues] = await Promise.all([
    Book.countDocuments(),
    Member.countDocuments(),
    Issue.countDocuments({ status: 'issued' }),
    Issue.countDocuments({ status: 'issued', dueDate: { $lt: new Date() } })
  ]);

  const recentIssues = await Issue.find()
    .populate('book member')
    .sort({ issueDate: -1 })
    .limit(5);

  res.render('dashboard', { totalBooks, totalMembers, activeIssues, overdueIssues, recentIssues });
});

app.use('/books', bookRoutes);
app.use('/members', memberRoutes);
app.use('/issues', issueRoutes);

// 404
app.use((req, res) => res.status(404).render('404'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
