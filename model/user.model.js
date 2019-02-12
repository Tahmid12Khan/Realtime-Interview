const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullName: String,
    userName:{
        type: String,
        required: true,
        unique: true,
      },
    password: String,
    role: String
});

module.exports = mongoose.model('User', UserSchema);