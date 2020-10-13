const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  actives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Active'
  }]
});

module.exports = mongoose.model('User', UserSchema);