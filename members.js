const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  const { search, type } = req.query;
  let query = {};
  if (search) query.$or = [
    { name: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') },
    { membershipId: new RegExp(search, 'i') }
  ];
  if (type) query.membershipType = type;

  const members = await Member.find(query).sort({ createdAt: -1 });
  res.render('members/index', { members, search, type });
});

router.get('/new', (req, res) => res.render('members/new', { error: null }));

router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.redirect('/members');
  } catch (err) {
    res.render('members/new', { error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const Issue = require('../models/Issue');
  const member = await Member.findById(req.params.id);
  if (!member) return res.redirect('/members');
  const issues = await Issue.find({ member: member._id }).populate('book').sort({ issueDate: -1 });
  res.render('members/show', { member, issues });
});

router.get('/:id/edit', async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.redirect('/members');
  res.render('members/edit', { member, error: null });
});

router.put('/:id', async (req, res) => {
  try {
    await Member.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    res.redirect('/members');
  } catch (err) {
    const member = await Member.findById(req.params.id);
    res.render('members/edit', { member, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.redirect('/members');
});

module.exports = router;
