
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

// convierte el id en string.
mongoose.Types.ObjectId.prototype.valueOf = function () {
  return this.toString();
};

module.exports = UserSchema;
