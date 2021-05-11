const express = require('express');
const routes = express.Router();
const controller = require('./couple.controller');
const checkToken = require('../../_shared/middlewares/auth');

routes.get('/couple', checkToken, controller.list);
routes.get('/couple/:id', checkToken, controller.getById);
routes.post('/couple', checkToken, controller.create);
routes.delete('/couple/:id', checkToken, controller.delete);
routes.put('/couple/:id', checkToken, controller.update);

module.exports = routes;
