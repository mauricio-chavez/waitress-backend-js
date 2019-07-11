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
  addItemToCurrentSessionAction,
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

    fakeLogin: async (parent, args, context, info) => {
      const { email, password } = args;
      return {
        message: `Hola, tu correo es ${ email }`,
      };
    },

    getSession: async (parent, args, context, info) => {
      const { sessionId } = args;
      return await getSessionAction(sessionId)
        .then(result => result)
        .catch(err => err);
    },

    getCurrentUserSession: async (parent, args, context, info) => {
      const { id } = context.user;
      return await getCurrentUserSessionAction(id)
        .then(result => result)
        .catch(err => err);
    },
  },

  Mutation: {

    signup: async (parent, args, context, info) => {
      return await signupAction({ ...args.data })
        .then(result => result)
        .catch(err => err);
    },

    login: async (parent, args, context, info) => {
      const { email, password } = args;
      return await loginAction(email, password)
        .then(result => result)
        .catch(error => error);
    },

    createSession: async (parent, args, context, info) => {
      const { id } = context.user;
      const { name } = args;
      return await createSessionAction(name, id)
        .then(result => result)
        .catch(error => { throw new UserInputError(error) });
    },

    addUserToSession: async (parent, args, context, info) => {
      const { userId, sessionId } = args;
      return await addUserToSessionAction(userId, sessionId)
        .then(result => result)
        .catch(err => { throw new UserInputError(err) });
    },

    addItemToUser: async (parent, args, context, info) => {
      const { id } = context.user;
      const { userId } = args;
      return await addItemToUserAction(userId, id, { ...args.item })
        .then(result => result)
        .catch(err => { throw new UserInputError(err)});
    },

    addItemToCurrentUser: async (parent, args, context, info) => {
      const { id } = context.user;
      return await addItemToCurrentUserAction(id, { ...args.item })
        .then(result => result)
        .catch(err => err);
    },

    addItemToCurrentSession: async (parent, args, context, info) => {
      const { id } = context.user;
      const { item } = args;
      return await addItemToCurrentSessionAction(item, id)
        .then(result => result)
        .catch(err => { throw new UserInputError(err)});
    },

    removeItemFromCurrentUser: async (parent, args, context, info) => {
      const { id } = context.user;
      const { itemId } = args;
      return await removeItemFromCurrentUserAction(itemId, id)
        .then(result => result)
        .catch(err => { throw new UserInputError(err)});
    },

    endUpSession: async (parent, args, context, info) => {
      const { id } = context.user;
      return await endUpSessionAction(id)
        .then(result => result)
        .catch(err => { throw new UserInputError(err)});
    },

  }
}

// exporta resolvers
module.exports = resolvers;
