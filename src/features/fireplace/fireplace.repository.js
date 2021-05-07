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

  findOne(conditions = {}, projection = null, options = {}) {
    return Fireplace.findOne(conditions, projection, options);
  }

  update(id, fireplace) {
    return Fireplace.findOneAndUpdate(
      { _id: id },
      { $set: fireplace },
      { new: true }
    );
  }

  delete(conditions = {}) {    
    return Fireplace.deleteOne(conditions);
  }
}

module.exports = new Repository();
