const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, trim: true, default: '' },
    email: { type: String, lowercase: true, unique: true, default: '' },
    password: { type: String, default: '' }
});

module.exports = mongoose.model('user', UserSchema);