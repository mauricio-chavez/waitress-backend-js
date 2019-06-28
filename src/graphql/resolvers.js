// importamos los modelos de la base de datos
const { UserModel } = require('../dataBase/models');

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
      return UserModel.create({ ...args.data }).then(() => {
        return { message: `se ha registrado el usuario ${args.data.name}` }
      }).catch(err => {
        return { message: `${err}` }
      })
    },
  }
}

module.exports = resolvers;
