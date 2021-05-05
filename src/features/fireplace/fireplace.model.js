const appContext = require('../../_shared/database/AppContext');
const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongooseTimestamp = require('mongoose-timestamp');

const schema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    addess: { type: String },
    neighborhood: { type: String },
    postalCode: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
    //   createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Subscriber',
    //     default: null,
    //   },
  },
  {
    versionKey: false,
  }
);

schema.plugin(mongooseDelete, { overrideMethods: true });
schema.plugin(mongooseTimestamp);

module.exports.FireplaceSchema = schema;
module.exports.Fireplace = appContext.conn.model('Fireplace', schema);
