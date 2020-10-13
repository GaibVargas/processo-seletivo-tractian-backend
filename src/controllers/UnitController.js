const Unit = require('../models/Unit');
const Company = require('../models/Company');
const Active = require('../models/Company');

module.exports = {
  async create(req, res) {
    const { name, company_id } = req.body;

    const company = await Company.findById(company_id);
  
    if(!company) return res.json({ message: 'Company not found' });

    const unit = await Unit.create({ name, company });
    await Company.findByIdAndUpdate({ _id: company_id }, { $push: { units: unit } });
  
    return res.json(unit);
  },

  async index(req, res) {
    const { company_id } = req.query;

    let units;

    if(!company_id || (company_id === "")) {
      units = await Unit.find().populate('company', 'name').populate('unit_id');
    } else {
      units = await Unit.find({ company: company_id }).populate('company', 'name').populate('actives');
    }
    
    return res.json(units);
  },

  async show(req, res) {
    const { unit_id } = req.params;

    try {
      const unit = await Unit.findById(unit_id).populate('company', 'name').populate('actives');

      return res.json(unit);
    } catch {
      return res.json({ message: 'Unit not found' });
    }
  },

  async update(req, res) {
    const { unit_id } = req.params;
    const { name, company_id } = req.body;

    const unit = await Unit.findById(unit_id);

    const oldCompany = unit.company;
    const newCompany = company_id;

    unit.name = name;
    await unit.save();

    unitChangesCompany = oldCompany !== newCompany;

    if(unitChangesCompany) {
      await Company.findByIdAndUpdate(oldCompany, { $pull: { "units": unit._id } });

      const company = await Company.findByIdAndUpdate(newCompany, { $push: { units: unit } } );
      unit.company = company;
      await unit.save();
    }

    return res.json(unit);
  },

  async delete(req, res) {
    const { unit_id } = req.params;

    const unit = await Unit.findByIdAndDelete(unit_id);

    const company = unit.company;

    await Company.findByIdAndUpdate(company, { $pull: { "units": unit._id } });

    res.send();
  }
}