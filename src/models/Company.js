const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
  },
  units: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  }]
});

module.exports = mongoose.model('Company', CompanySchema);