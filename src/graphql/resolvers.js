const { UserInputError } = require('apollo-server');

// importamos los modelos de la base de datos
const { UserModel } = require('../dataBase/models');

// importamos las acciones(logica de negocio) para los resolvers
const {
  loginAction,
  signupAction,
} = require('../actions/userActions');


const {
  getSessionAction,
  getCurrentUserSessionAction,
  createSessionAction,
  addUserToSessionAction,
  endUpSessionAction,
} = require('../actions/sessionActions');

const {
  addItemToUserAction,
  addItemToCurrentUserAction,
  removeItemFromCurrentUserAction
} = require('../actions/itemActions');

// Resolvers funciones que son la logica del negocio y son acciones que define como se
// comportan las queries y las mutations
// parent --- es lo que necesita la funcion para que funcione como un resolver
// args -- argumentos que recibe la funcion
// context -- se variables que se comparte atravez de todos los resolvers
// info 

const resolvers = {
  Query: {
    getSession: (parent, args, context, info) => {
      const { sessionId } = args;
      return getSessionAction(sessionId)
        .then(result => result)
        .catch(err => err);
    },
    getCurrentUserSession: (parent, args, context, info) => {
      const { id } = context.user;
      return getCurrentUserSessionAction(id)
        .then(result => result)
        .catch(err => err);
    },
  },
  Mutation: {
    signup: (parent, args, context, info) => {
      return signupAction({ ...args.data }).then(result => {
        return result;
      }).catch(err => {
        return err;
      });
    },
    login: (parent, args, context, info) => {
      const { email, password } = args;
      return loginAction(email, password).then(result => {
        return result;
      }).catch(error => {
        return error;
      })
    },
    createSession: (parent, args, context, info) => {
      const { id } = context.user;
      const { name } = args;
      return createSessionAction(name, id)
        .then(result => result)
        .catch(error => { throw new UserInputError(error) });
    },
    addUserToSession: (parent, args, context, info) => {
      const { userId, sessionId } = args;
      return addUserToSessionAction(userId, sessionId)
        .then(result => result)
        .catch(err => { throw new UserInputError(err) });
    },
    addItemToUser: (parent, args, context, info) => {
      const { id } = context.user;
      const { userId } = args;
      return addItemToUserAction(userId, id, { ...args.item })
        .then(result => result)
        .catch(err => { throw new UserInputError(err)});
    },
    addItemToCurrentUser: (parent, args, context, info) => {
      const { id } = context.user;
      return addItemToCurrentUserAction(id, { ...args.item })
        .then(result => result)
        .catch(err => err);
    },
    removeItemFromCurrentUser: (parent, args, context, info) => {
      const { id } = context.user;
      const { itemId } = args;
      return removeItemFromCurrentUserAction(itemId, id)
        .then(result => result)
        .catch(err => { throw new UserInputError(err)});
    },
  }
}

// exporta resolvers
module.exports = resolvers;
