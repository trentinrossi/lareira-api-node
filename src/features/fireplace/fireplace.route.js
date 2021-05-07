const express = require('express');
const routes = express.Router();
const controller = require('./fireplace.controller');

routes.get('/fireplace', controller.list);
routes.get('/fireplace/:id', controller.getById);
routes.post('/fireplace', controller.create);
routes.delete('/fireplace/:id', controller.delete);
routes.put('/fireplace/:id', controller.update);

module.exports = routes;
