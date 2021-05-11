const express = require('express');
const routes = express.Router();
const loginController = require('./login.controller');
const checkToken = require('../../_shared/middlewares/auth');

routes.post('/signup', loginController.signup);
routes.post('/login', loginController.login);
routes.post('/logout', loginController.logout);
routes.get('/userDetails', checkToken, (req, res) => {
  res.send('OK');
});

module.exports = routes;
