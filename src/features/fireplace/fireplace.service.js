const repository = require('./fireplace.repository');
const pagingHelper = require('../../helpers/paging.helper');
const filterHelper = require('../../helpers/filter.helper');

class Service {
  async list(params) {
    const query = filterHelper.build(params);
    const paging = pagingHelper.build(params);
    const total = await repository.count(query);    
    const data = await repository.list(query, paging);    
    
    return { meta: pagingHelper.resolve(paging, total), data };
  }

  getById(id) {
    return repository.findOne({ _id: id });
  }

  create(fireplace) {
    return repository.create(fireplace);
  }

  update(id, fireplace) {
    return repository.update(id, fireplace);
  }

  delete(id) {
    return repository.delete({ _id: id });
  }
}

module.exports = new Service();
