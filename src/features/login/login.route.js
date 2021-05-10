const express = require('express');
const routes = express.Router();
const loginController = require('./login.controller');
const auth = require('../../_shared/middlewares/auth');

routes.post('/signup', loginController.signup);
routes.post('/login', loginController.login);
routes.get('/userDetails', auth, (req, res) => {
  res.send('OK');
});

module.exports = routes;
