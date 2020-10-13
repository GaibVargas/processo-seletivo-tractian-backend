const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  actives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Active'
  }]
});

module.exports = mongoose.model('Unit', UnitSchema);