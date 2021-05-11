const { Couple } = require('./couple.model');

class Repository {
  create(couple) {
    return Couple.create(couple);
  }

  async list(conditions = {}, paging) {
    return Couple.find(conditions)
        .collation({ locale: 'en' })
        .limit(paging.limit)
        .skip(paging.skip)
        .sort(paging.sort)
        .lean();
  }

  count(conditions = {}) {
    return Couple.count(conditions);
  }

  findOne(conditions = {}, projection = null, options = {}) {
    return Couple.findOne(conditions, projection, options);
  }

  update(id, couple) {
    return Couple.findOneAndUpdate({ _id: id }, { $set: couple }, { new: true });
  }

  delete(conditions = {}) {
    return Couple.deleteOne(conditions);
  }
}

module.exports = new Repository();
