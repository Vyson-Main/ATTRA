const bcrypt = require('bcrypt');

const ROUNDS = 12;

async function hash(plaintext) {
  return bcrypt.hash(plaintext, ROUNDS);
}

async function compare(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed);
}

module.exports = { hash, compare };
