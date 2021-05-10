const appContext = require('../../_shared/database/AppContext');
const mongoose = require('mongoose');
const mongooseTimestamp = require('mongoose-timestamp');

const schema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },    
  },
  {
    versionKey: false
  }
);

schema.plugin(mongooseTimestamp);

module.exports.UserSchema = schema;
module.exports.User = appContext.conn.model('User', schema);
