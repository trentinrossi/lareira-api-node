const express = require('express');
const routes = express.Router();
const controller = require('./child.controller');
const checkToken = require('../../_shared/middlewares/auth');

routes.post('/couple/:id/child', checkToken, controller.addChild);
routes.put('/couple/:id/child/:idChild', checkToken, controller.updateChild);
routes.delete('/couple/:id/child/:idChild', checkToken, controller.deleteChild);

module.exports = routes;
