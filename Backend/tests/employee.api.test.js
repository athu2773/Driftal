const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
require('dotenv').config();

let server;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/employees', require('../routes/employee.routes'));
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  server = app.listen(0); // random available port
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Employee API', () => {
  let empId;

  it('should create a new employee', async () => {
    const res = await request(server)
      .post('/api/employees')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'QA Engineer',
        assessment_submitted: true,
        assessment_answers: { q1: 'AI', q14: 'Goal', q16: 'Learn', q17: 'Skill', q19: 'Culture', q20: 'Aspire' },
        tags: ['AI Enthusiast'],
        learning_score: 80,
        submission_date: new Date(),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');
    empId = res.body._id;
  });

  it('should get the created employee', async () => {
    const res = await request(server).get(`/api/employees/${empId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('testuser@example.com');
  });

  it('should update the employee', async () => {
    const res = await request(server)
      .put(`/api/employees/${empId}`)
      .send({ role: 'Product Manager' });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('Product Manager');
  });

  it('should list employees with filter', async () => {
    const res = await request(server).get('/api/employees?search=Test');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should delete the employee', async () => {
    const res = await request(server).delete(`/api/employees/${empId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
