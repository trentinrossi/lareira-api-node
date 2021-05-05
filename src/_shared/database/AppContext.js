const Mongoose = require('mongoose');
const environment = require('../environment');

class AppContext {
  static get conn() {
    if (!AppContext.connection) throw new Error('AppContext is not connected!');
    return AppContext.connection;
  }

  static connect() {
    const cs = process.env.MONGO_PORTAL;
    AppContext.connection = Mongoose.createConnection(
      cs,
      environment.MONGO_SETTINGS
    );
  }
}

module.exports = AppContext;
