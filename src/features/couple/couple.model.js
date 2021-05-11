const appContext = require('../../_shared/database/AppContext');
const mongoose = require('mongoose');
const mongooseTimestamp = require('mongoose-timestamp');

const schema = new mongoose.Schema(
  {
    recordNumber: { type: Number, required: true },
    fireplace: { type: mongoose.Schema.Types.ObjectId, ref: 'Fireplace', required: true },
    phone: { type: String },
    marriageDate: { type: Date, default: new Date('1970-01-01T00:00:00') },
    marriageType: {
      type: String,
      enum: ['CPB', 'CUB', 'PFA', 'SB', 'SOB'],
      default: 'CPB'
    },
    memo: { type: String },
    husband: {
      name: { type: String, required: true },
      lastName: { type: String, required: true },
      birthDate: { type: Date, default: new Date('1970-01-01T00:00:00') },
      position: { type: String },
      cellphone: { type: String },
      email: { type: String },
      healthProblem: { type: String }
    },
    wife: {
      name: { type: String, required: true },
      lastName: { type: String, required: true },
      birthDate: { type: Date, default: new Date('1970-01-01T00:00:00') },
      position: { type: String },
      cellphone: { type: String },
      email: { type: String },
      healthProblem: { type: String }
    },
    godparents: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple' },
    address: {
      postalCode: { type: String },
      street: { type: String },
      number: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String }
    },
    child: [
      {
        name: { type: String, required: true },
        gender: { type: String, enum: ['M', 'F'] },
        birthDate: { type: Date, default: new Date('1970-01-01T00:00:00') }
      }
    ]
  },
  {
    versionKey: false
  }
);

schema.plugin(mongooseTimestamp);

module.exports.CoupleSchema = schema;
module.exports.Couple = appContext.conn.model('Couple', schema);
