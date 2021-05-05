const { onError, onSuccess, onCreated } = require('../../_shared/handlers/request-handler');
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
}

module.exports = new Controller();
