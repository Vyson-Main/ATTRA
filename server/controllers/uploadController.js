const fs = require('fs');
const StudentModel = require('../models/Student');
const UploadModel = require('../models/Upload');
const { parseClassList } = require('../services/fileParser');
const { hash } = require('../services/hashService');

/**
 * POST /api/upload/classlist
 * Each student's default password = their own student ID.
 * They should change it on first login.
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
      fs.unlinkSync(filePath);
      return res.status(422).json({ error: parseErr.message });
    }

    // Hash each student's ID as their individual default password
    const studentsWithHashes = await Promise.all(
      students.map(async (s) => ({
        ...s,
        passwordHash: await hash(s.student_id),
      }))
    );

    await StudentModel.replaceAllWithHashes(studentsWithHashes);

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

async function getUploadHistory(req, res, next) {
  try {
    const uploads = await UploadModel.findAll(req.user.id);
    res.json({ uploads });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadClassList, getUploadHistory };
