'use strict';

const { onError, onSuccess, onCreated, onBadRequest, onNoContent, onUpdated } = require('../../_shared/handlers/request-handler');
const service = require('./couple.service');

class Controller {  
  async addChild(req, res) {
    try {
      const { id: idCouple } = req.params;
      const child = req.body;

      let couple = await service.getById(idCouple);

      if (!couple) {
        onBadRequest({ message: `Couple ${idCouple} not found` }, res);
      }

      couple.child.push(child);
      couple.updatedAt = new Date();
      couple.createdAt = undefined;

      const updated = await service.update(idCouple, couple);
      onUpdated(updated, res);
    } catch (e) {
      onError('Error trying to add child to couple', e.toString(), res);
    }
  }

  async updateChild(req, res) {
    try {
      const { id: idCouple, idChild } = req.params;
      const child = req.body;

      let couple = await service.getById(idCouple);

      if (!couple) {
        onBadRequest({ message: `Couple ${idCouple} not found` }, res);
      }
      couple.child = couple.child.map((childInDb) => {
        if (childInDb._id == idChild) {
          childInDb.name = child.name;
          childInDb.gender = child.gender;
          childInDb.birthDate = child.birthDate;
        }
        return childInDb;
      });

      console.log(couple.child);
      couple.updatedAt = new Date();
      couple.createdAt = undefined;

      const updated = await service.update(idCouple, couple);
      onUpdated(updated, res);
    } catch (e) {
      onError('Error trying to add child to couple', e.toString(), res);
    }
  }

  async deleteChild(req, res) {
    try {
      const { id: idCouple, idChild } = req.params;      

      let couple = await service.getById(idCouple);

      if (!couple) {
        onBadRequest({ message: `Couple ${idCouple} not found` }, res);
      }

      couple.child = couple.child.filter((childInDb) => (childInDb._id != idChild));
      
      couple.updatedAt = new Date();
      couple.createdAt = undefined;

      const updated = await service.update(idCouple, couple);
      onNoContent(res);
    } catch (e) {
      onError('Error trying to add child to couple', e.toString(), res);
    }
  }
}

module.exports = new Controller();
