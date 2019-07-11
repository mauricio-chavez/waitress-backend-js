const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    }
  ],
  sharedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'items',
    }
  ],
}, {timestamps: true});

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString();
};

module.exports = SessionSchema;
