const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');

/**
 * Parse a class list file (CSV or Excel).
 * Returns array of { student_id, name }
 */
function parseClassList(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let rows;

  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    rows = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } else if (['.xlsx', '.xls'].includes(ext)) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  } else {
    throw new Error('Unsupported file type');
  }

  return normalizeRows(rows);
}

/**
 * Normalize column names: accept 'id'/'student_id'/'student id' etc.
 */
function normalizeRows(rows) {
  if (!rows || rows.length === 0) throw new Error('File is empty');

  // Detect columns (case-insensitive)
  const sample = rows[0];
  const keys = Object.keys(sample);

  const idKey = keys.find(k =>
    /^(id|student[_\s]?id|no\.?|number)$/i.test(k.trim())
  );
  const nameKey = keys.find(k =>
    /^(name|full[_\s]?name|student[_\s]?name)$/i.test(k.trim())
  );
  const sectionKey = keys.find(k => /^(section|class|course)$/i.test(k.trim()));

  if (!idKey) throw new Error('Missing "id" or "student_id" column in file');
  if (!nameKey) throw new Error('Missing "name" or "full_name" column in file');

  const students = [];
  const seen = new Set();

  for (const row of rows) {
    const id = String(row[idKey] || '').trim();
    const name = String(row[nameKey] || '').trim();
    const section = sectionKey ? String(row[sectionKey] || '').trim() : '';

    if (!id || !name) continue;
    if (seen.has(id)) continue; // skip duplicates
    seen.add(id);

    students.push({ student_id: id, name, section });
  }

  if (students.length === 0) {
    throw new Error('No valid student rows found in file');
  }

  return students;
}

module.exports = { parseClassList };
