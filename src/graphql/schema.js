
const { gql } = require('apollo-server');

// typeDefs, esquema de graphql que define los datos que seran almacenados en la aplicacion
// y la logica de negocio (queries y mutations)
// Queries -- GET -- pide datos
// Mutations -- PUT, PATCH, DELETE, POST -- sirven para crear datos, eliminarlos y actualizarlos
// NOTA: necesita como minimo un query para funcionar.

const typeDefs = gql`
  type Auth {
    message: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
  }

  type Query {
    newQuery: Auth
  }

  type Mutation {
    signup(data: UserInput): Auth
  }
`;

module.exports = typeDefs;
