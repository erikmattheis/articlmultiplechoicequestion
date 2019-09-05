/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable sort-keys */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  login: String,
  pass: String,
  nicename: String,
  avatar: String,
  email: String,
  url: String,
  registered: String,
  level: Number,
  first: String,
  last: String,
  education: String,
  institution: String,
  specialty: String,
  'sub-specialty': String,
  deleted: Boolean
});

userSchema.index({ '$**': 'text' });

userSchema.pre('save', async function doHash(next) {
  this.pass = await bcrypt.hash(this.pass, 10);
  next();
});

userSchema.methods.isValidPassword = async function isValidPassword(pass) {
  const compare = await bcrypt.compare(pass, this.pass);
  return compare;
};

exports.User = mongoose.model('User', userSchema);
