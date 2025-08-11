const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

// Helper: build filter from query params
function buildFilter(query) {
  const filter = {};
  if (query.submitted === 'true') filter.assessment_submitted = true;
  if (query.submitted === 'false') filter.assessment_submitted = false;
  if (query.role) filter.role = query.role;
  if (query.tags) {
    const tags = query.tags.split(',').map(t => t.trim());
    filter.tags = { $in: tags };
  }
  if (query.search) {
    const q = query.search;
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { 'assessment_answers.q1': { $regex: q, $options: 'i' } },
      { 'assessment_answers.q14': { $regex: q, $options: 'i' } },
      { 'assessment_answers.q20': { $regex: q, $options: 'i' } },
    ];
  }
  // Advanced filters
  if (query.longTermGoal) {
    filter['assessment_answers.q14'] = { $regex: query.longTermGoal, $options: 'i' };
  }
  if (query.workCulture) {
    filter['assessment_answers.q19'] = { $regex: query.workCulture, $options: 'i' };
  }
  if (query.learningAttitude) {
    filter.$or = [
      { 'assessment_answers.q16': { $regex: query.learningAttitude, $options: 'i' } },
      { 'assessment_answers.q17': { $regex: query.learningAttitude, $options: 'i' } },
    ];
  }
  if (query.interestArea) {
    filter['assessment_answers.q1'] = { $regex: query.interestArea, $options: 'i' };
  }
  return filter;
}

// GET /employees - list with filters, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      sort = 'createdAt:desc',
      learningScoreMin,
      learningScoreMax,
    } = req.query;

    const filter = buildFilter(req.query);

    if (learningScoreMin)
      filter.learning_score = { ...filter.learning_score, $gte: Number(learningScoreMin) };
    if (learningScoreMax)
      filter.learning_score = { ...filter.learning_score, $lte: Number(learningScoreMax) };

    // parse sort
    const [sortKey, sortDir] = sort.split(':');
    const sortObj = { [sortKey]: sortDir === 'asc' ? 1 : -1 };

    const docs = await Employee.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Employee.countDocuments(filter);

    res.json({
      data: docs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /employees/:id
router.get('/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /employees - create
router.post('/', async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT /employees/:id - update
router.put('/:id', async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// DELETE /employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /employees/export/csv
router.get('/export/csv', async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const docs = await Employee.find(filter);

    const csvWriter = createCsvWriter({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'role', title: 'Role' },
        { id: 'assessment_submitted', title: 'Submitted' },
        { id: 'submission_date', title: 'Submission Date' },
        { id: 'tags', title: 'Tags' },
      ],
    });

    const records = docs.map(emp => ({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      assessment_submitted: emp.assessment_submitted ? 'Yes' : 'No',
      submission_date: emp.submission_date ? emp.submission_date.toISOString().slice(0, 10) : '',
      tags: emp.tags.join(', '),
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employees.csv"');
    res.send(csvWriter.stringifyRecords(records));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;