// importamos los modelos de la base de datos
const { UserModel } = require('../dataBase/models');

// importamos las acciones(logica de negocio) para los resolvers
const {
  loginAction,
  signupAction,
} = require('../actions/userActions');

// Resolvers funciones que son la logica del negocio y son acciones que define como se
// comportan las queries y las mutations
// parent --- es lo que necesita la funcion para que funcione como un resolver
// args -- argumentos que recibe la funcion
// context -- se variables que se comparte atravez de todos los resolvers
// info 

const resolvers = {
  Query: {
    newQuery: () => {
      return { message: 'Este es un mensaje de prueba' }
    }
  },
  Mutation: {
    signup: (paret, args, context, info) => {
      return signupAction({ ...args.data }).then(() => {
        return { message: `se ha registrado el usuario ${args.data.name}` }
      }).catch(err => {
        return { message: `${err}` }
      });
    },
    login: (parent, args, context, info) => {
      const { email, password } = args;
      return loginAction(email, password).then(result => {
        return result;
      }).catch(error => {
        return error;
      })
    }
  }
}

// exporta resolvers
module.exports = resolvers;