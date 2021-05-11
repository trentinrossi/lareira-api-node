const express = require('express');
const routes = express.Router();
const controller = require('./fireplace.controller');
const checkToken = require('../../_shared/middlewares/auth');

routes.get('/fireplace', checkToken, controller.list);
routes.get('/fireplace/:id', checkToken, controller.getById);
routes.post('/fireplace', checkToken, controller.create);
routes.delete('/fireplace/:id', checkToken, controller.delete);
routes.put('/fireplace/:id', checkToken, controller.update);

module.exports = routes;
