const Company = require('../models/Company');
const Unit = require('../models/Unit');
const Active = require('../models/Active');

module.exports = {
  async create(req, res) {
    const { name, cnpj } = req.body;

    const cnpjExists = await Company.findOne({ cnpj });

    if(cnpjExists) return res.json({ message: 'CNPJ already exists' });

    const company = await Company.create({
      name,
      cnpj
    });

    return res.json(company);
  },

  async index(req, res) {
    const companies = await Company.find();

    return res.json(companies);
  },

  async show(req, res) {
    const { company_id } = req.params;
 
    try {
      const company = await Company.findById(company_id);

      return res.json(company);
    } catch {
      return res.json({ message: 'Company not found' });
    }
  },

  async update(req, res) {
    const { company_id } = req.params;
    const { name, cnpj } = req.body;

    if(!name || !cnpj) return res.json({ message: 'Name and CNPJ are required' });

    const exists = await Company.findOne({ cnpj });
    const idIsDifferent = String(company_id) !== String(exists._id);

    if(exists && idIsDifferent) return res.json({ message: 'CNPJ already exists' });

    await Company.findByIdAndUpdate(company_id);

    return res.send();
  },

  async delete(req, res) {
    const { company_id } = req.params;

    const company = await Company.findByIdAndDelete(company_id);

    for(id of company.units) {
      await Unit.findByIdAndDelete(id);
    }

    return res.send();
  }
}