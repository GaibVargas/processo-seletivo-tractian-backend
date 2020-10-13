const mongoose = require('mongoose');

const ActiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  model: String,
  health_score: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  image: String,
  unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Active', ActiveSchema);