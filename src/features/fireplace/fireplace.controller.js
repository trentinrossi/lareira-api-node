const { onError, onSuccess, onCreated, onBadRequest, onNoContent, onUpdated } = require('../../_shared/handlers/request-handler');
const service = require('./fireplace.service');

class Controller {
  async list(req, res) {
    try {
      const ret = await service.list(req.query);
      onSuccess(ret.meta, ret.data, res);
    } catch (e) {
      onError('Error trying to list fireplaces', e.toString(), res);
    }
  }

  async create(req, res) {
    try {
      const data = await service.create(req.body);
      onCreated(data, res);
    } catch (e) {
      onError('Error trying to create fireplace', e.toString(), res);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await service.getById(id);

      if (!result) {
        onBadRequest({ message: `Fireplace ${id} not found` }, res);
      }

      onSuccess({}, result, res);
    } catch (e) {
      onError('Error trying to find fireplace by id', e.toString(), res);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await service.getById(id);

      if (!result) {
        onBadRequest({ message: `Fireplace ${id} not found` }, res);
      }
      await service.delete(id);
      onNoContent(res);
    } catch (e) {
      onError('Error trying to delete fireplace', e.toString(), res);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await service.getById(id);

      if (!result) {
        onBadRequest({ message: `Fireplace ${id} not found` }, res);
      }

      const updated = await service.update(id, req.body);
      onUpdated(updated, res);
    } catch (e) {
      onError('Error trying to update fireplace', e.toString(), res);
    }
  }
}

module.exports = new Controller();
