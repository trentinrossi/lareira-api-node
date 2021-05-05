const { Fireplace } = require('./fireplace.model');

class Repository {
  create(fireplace) {
    return Fireplace.create(fireplace);
  }

  async list(conditions = {}, paging) {
    return Fireplace.find(conditions)
      .collation({ locale: 'en' })
      .limit(paging.limit)
      .skip(paging.skip)
      .sort(paging.sort)
      .lean();
  }

  count(conditions = {}) {    
    return Fireplace.count(conditions);
  }

  findOne(conditions = {}) {
    return Fireplace.findOne(conditions);
  }

  update(id, fireplace) {
    return Fireplace.findOneAndUpdate(
      { _id: id },
      { $set: fireplace },
      { new: true }
    );
  }

  delete(conditions = {}) {
    return Fireplace.delete(conditions);
  }
}

module.exports = new Repository();
