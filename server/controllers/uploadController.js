const fs = require('fs');
const StudentModel = require('../models/Student');
const UploadModel = require('../models/Upload');
const { parseClassList } = require('../services/fileParser');
const { hash } = require('../services/hashService');

/**
 * POST /api/upload/classlist
 * Teacher uploads CSV/Excel file → parse → replace student list.
 */
async function uploadClassList(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let students;

    try {
      students = parseClassList(filePath);
    } catch (parseErr) {
      // Clean up the uploaded file on parse failure
      fs.unlinkSync(filePath);
      return res.status(422).json({ error: parseErr.message });
    }

    // Default password for newly imported students: "student123"
    const defaultPassword = await hash('student123');
    await StudentModel.replaceAll(students, defaultPassword);

    // Record the upload
    const upload = await UploadModel.create({
      teacherId: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      studentCount: students.length,
    });

    res.status(201).json({
      message: `${students.length} students imported successfully`,
      upload,
      students,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/upload/history
 */
async function getUploadHistory(req, res, next) {
  try {
    const uploads = await UploadModel.findAll(req.user.id);
    res.json({ uploads });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadClassList, getUploadHistory };
