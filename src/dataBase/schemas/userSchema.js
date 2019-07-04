const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'items'
  }],
}, {timestamps: true});

// TODO Timestamps

mongoose.Types.ObjectId.prototype.valueOf = function () {
  return this.toString();
};

// mongoose hook, hace un hash del password y lo asigna al user.password
// Paso 1 - validamos si el usuario cambia el password
// Paso 2 - generamos un hash con una repeticion de 10
// Paso 3 - hacemos un hash del password y lo asignamos al usuario.
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

module.exports = UserSchema;
