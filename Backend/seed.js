require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Employee = require('./models/employee.model');

const sample = async () => {
  await connectDB(process.env.MONGO_URI);

  await Employee.deleteMany({});

  const tagsPool = [
    'AI Enthusiast', 'HR-Tech Passionate', 'Looking to explore',
    'Career-focused', 'Entrepreneurial', 'Technically inclined', 'Unclear/Exploring',
    'Prefers healthy culture', 'Salary-driven', 'Active Learner', 'Passive Learner'
  ];

  const roles = ['Software Engineer', 'Backend Developer', 'Frontend Developer', 'Product Manager', 'QA Engineer'];

  const employees = [];
  for (let i = 1; i <= 40; i++) {
    const name = `Employee ${i}`;
    const email = `employee${i}@example.com`;
    const role = roles[i % roles.length];
    const submitted = i % 3 !== 0; // some not submitted
    const tags = [];
    if (i % 2 === 0) tags.push('AI Enthusiast');
    if (i % 5 === 0) tags.push('Entrepreneurial');
    if (i % 6 === 0) tags.push('Salary-driven');

    const learning_score = Math.floor(Math.random() * 100);

    employees.push({
      name,
      email,
      role,
      assessment_submitted: submitted,
      assessment_answers: {
        q1: 'Interested in AI because ...',
        q14: 'My long term goal is ...',
        q16: 'I completed course X',
        q17: 'I learn from Y',
        q19: 'I prefer healthy culture',
        q20: 'Aspire to ...',
      },
      tags,
      learning_score,
      submission_date: submitted ? new Date(Date.now() - i * 86400000) : null,
    });
  }

  await Employee.insertMany(employees);
  console.log('Seeded employees');
  process.exit(0);
};

sample();