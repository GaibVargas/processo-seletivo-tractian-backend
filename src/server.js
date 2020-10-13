const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect(process.env.URL_CONNECTION_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(process.env.PORT || 3333);