const express = require('express');
const routes = express.Router();
const controller = require('./fireplace.controller');

routes.get('/fireplace', controller.list);
routes.post('/fireplace', controller.create);

module.exports = routes;
