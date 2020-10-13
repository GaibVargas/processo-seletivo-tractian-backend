const path = require('path');
const multer = require('multer');

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(req, file, cb) {
      const [_, type] = file.mimetype.split('/');

      const name = `${Date.now()}.${type}`;
      cb(null, name);
    }
  }),
}