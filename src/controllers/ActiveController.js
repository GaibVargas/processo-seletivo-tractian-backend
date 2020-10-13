const fs = require('fs');
const path = require('path');

const Active = require('../models/Active');
const Unit = require('../models/Unit');
const User = require('../models/User');

module.exports = {
  async create(req, res) {
    const {
      name, description, model,
      health_score, status,
      user_id, unit_id
    } = req.body;

    const { filename } = req.file;

    if(!name || health_score === "" || status === "" || !user_id || !unit_id) {
      return res.json({
        message: "Name, Health_score, Status, Responsable and Unit are required"
      });
    }

    const unit = await Unit.findById(unit_id);
    if(!unit) return res.json({ message: 'Unit not found' });

    const user = await User.findById(user_id);
    if(!user) return res.json({ message: 'Responsable not found' });

    
    const active = await Active.create({
      name, description, model,
      health_score, status, image: `${process.env.IMAGE_LINK}${filename}`,
      user_id, unit_id
    });
    
    await Unit.findByIdAndUpdate(unit_id, { $push: { actives: active } });
    await User.findByIdAndUpdate(user_id , { $push: { actives: active } });

    return res.json(active);
  },

  async index(req, res) {
    const { unit_id } = req.query;

    let actives;

    if((!unit_id ) || (unit_id === '')) {
      actives = await Active.find().populate('user_id', 'name').populate('unit_id', 'name');
    } else {
      actives = await Active.find({ unit_id }).populate('user_id', 'name').populate('unit_id', 'name');
    }

    return res.json(actives);
  },
   
  async show(req, res) {
    const { active_id } = req.params;

    const active = await Active.findById(active_id).populate('user_id', 'name').populate('unit_id', 'name');

    return res.json(active);
  },

  async delete(req, res) {
    const { active_id } = req.params;

    const active = await Active.findByIdAndDelete(active_id);

    const user_id = active.user_id;
    const unit_id = active.unit_id;

    await Unit.findByIdAndUpdate(unit_id, { $pull: { "actives": active._id } });
    await User.findByIdAndUpdate(user_id, { $pull: { "actives": active._id } });

    const linkSplited = active.image.split('/');

    fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', linkSplited[linkSplited.length - 1]));

    return res.send();
  },

  async update(req, res) {
    const { active_id } = req.params;

    const {
      name, description, model,
      health_score, status,
      user_id, unit_id
    } = req.body;

    if(!name || health_score === "" || status === "" || !user_id || !unit_id) {
      return res.json({
        message: "Name, Health_score, Status, Responsable and Unit are required"
      });
    }

    const active = await Active.findById(active_id);

    active.name = name;
    active.description = description;
    active.model = model;
    active.health_score = health_score;
    active.status = status;
    await active.save();

    const oldUser = active.user_id;
    const newUser = user_id;

    const activeChangesUser = oldUser !== newUser;

    if(activeChangesUser) {
      await User.findByIdAndUpdate(oldUser, { $pull: { "actives": active_id } });

      const user = await User.findByIdAndUpdate(newUser, { $push: { actives: active } } );
      active.user_id = user._id;
      await active.save();
    }

    const oldUnit = active.unit_id;
    const newUnit = unit_id;

    const activeChangesUnit = oldUnit !== newUnit;

    if(activeChangesUnit) {
      await Unit.findByIdAndUpdate(oldUnit, { $pull: { "actives": active_id } });

      const unit = await Unit.findByIdAndUpdate(newUnit, { $push: { actives: active } });
      active.unit_id = unit._id;
      await active.save();
    }

    if(req.file) {
      const { filename: newFilename } = req.file;

      const arrayLink = active.image.split('/');
      const oldFilename = arrayLink[arrayLink.length - 1];

      fs.unlinkSync(path.resolve(__dirname, '..', '..', 'uploads', oldFilename));

      active.image = `${process.env.IMAGE_LINK}${newFilename}`;
      await active.save();
    }

    return res.json(active);
  }
}