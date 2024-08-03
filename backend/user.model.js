// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  interest: [String],
  age: { type: Number, required: true },
  mobile: { type: Number, required: true },
  email: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
