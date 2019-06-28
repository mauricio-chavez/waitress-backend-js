const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');

const UserModel = mongoose.model("usersCintaNegra", UserSchema);


module.exports = {
  UserModel,
}
