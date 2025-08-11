const mongoose = require('mongoose');

const AnswersSchema = new mongoose.Schema({}, { strict: false });

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, default: 'Software Engineer' },
    assessment_submitted: { type: Boolean, default: false },
    assessment_answers: { type: AnswersSchema, default: {} },
    tags: { type: [String], default: [] },
    learning_score: { type: Number, default: 0 },
    submission_date: { type: Date },
  },
  { timestamps: true }
);

EmployeeSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Employee', EmployeeSchema);