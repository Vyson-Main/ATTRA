const StudentModel = require('../models/Student');

async function getAll(req, res, next) {
  try {
    const { search, section } = req.query;
    const students = await StudentModel.findAll({ search, section });
    res.json({ students, count: students.length });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ student });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne };
