const User = require('../models/User');

module.exports = {
  async create(req, res) {
    const { name } = req.body;

    const userExists = await User.findOne({ name });

    if(userExists) return res.json({ message: 'User name already exists' });

    const user = await User.create({ name });

    return res.json(user);
  },

  async index(req, res) {
    const users = await User.find().populate('actives');

    return res.json(users);
  },

  async show(req, res) {
    const { user_id } = req.params;

    try {
      const user = await User.findById(user_id).populate('actives');

      return res.json(user);
    } catch {
      return res.json({ message: 'User not found' });
    }
  },

  async update(req, res) {
    const { user_id } = req.params;
    const { name } = req.body;

    if(!name) return res.json({ message: 'Name is required' });

    await User.findByIdAndUpdate(user_id, {
      name
    });

    return res.send();
  },

  async delete(req, res) {
    const { user_id } = req.params;

    await User.findByIdAndDelete(user_id);

    return res.send();
  }
}