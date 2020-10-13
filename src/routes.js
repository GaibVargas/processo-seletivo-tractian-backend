const routes = require('express').Router();
const multer = require('multer');
const configMulter = require('./config/multer');

const UserController = require('./controllers/UserController');
const CompanyController = require('./controllers/CompanyController');
const UnitController = require('./controllers/UnitController');
const ActiveController = require('./controllers/ActiveController');

routes.get('/users', UserController.index);
routes.get('/users/:user_id', UserController.show);
routes.post('/users', UserController.create);
routes.put('/users/:user_id', UserController.update);
routes.delete('/users/:user_id', UserController.delete);

routes.get('/companies', CompanyController.index);
routes.get('/companies/:company_id', CompanyController.show);
routes.post('/companies', CompanyController.create);
routes.put('/companies/:company_id', CompanyController.update);
routes.delete('/companies/:company_id', CompanyController.delete);

routes.get('/units', UnitController.index);
routes.get('/units/:unit_id', UnitController.show);
routes.post('/units', UnitController.create);
routes.put('/units/:unit_id', UnitController.update);
routes.delete('/units/:unit_id', UnitController.delete);

const upload = multer(configMulter);

routes.get('/actives', ActiveController.index);
routes.get('/actives/:active_id', ActiveController.show);
routes.post('/actives', upload.single('image'), ActiveController.create);
routes.put('/actives/:active_id', upload.single('image'), ActiveController.update);
routes.delete('/actives/:active_id', ActiveController.delete);

module.exports = routes;