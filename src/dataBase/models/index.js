const mongoose = require('mongoose');

const UserSchema = require('../schemas/userSchema');
const SessionSchema = require('../schemas/sessionSchema');
const ItemSchema = require('../schemas/itemSchema');

const UserModel = mongoose.model('users', UserSchema);
const SessionModel = mongoose.model('sessions', SessionSchema);
const ItemModel = mongoose.model('items', ItemSchema);


module.exports = {
  UserModel,
  SessionModel,
  ItemModel,
}
