
// importar paquetes
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// crea un nuevo esquema
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
  },
  password: {
    type: String,
    required: true,
  }
});

// convierte el id en string.
mongoose.Types.ObjectId.prototype.valueOf = function () {
  return this.toString();
};

// mongoose hook, hace un hash del password y lo asigna al user.password
UserSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, function (error, salt) {
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) return next(error);
      user.password = hash;
      next();
    })
  })
});

// exporta el UserSchema
module.exports = UserSchema;
