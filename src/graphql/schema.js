
const { gql } = require('apollo-server');

// typeDefs, esquema de graphql que define los datos que seran almacenados en la aplicacion
// y la logica de negocio (queries y mutations)
// Queries -- GET -- pide datos
// Mutations -- PUT, PATCH, DELETE, POST -- sirven para crear datos, eliminarlos y actualizarlos
// NOTA: necesita como minimo un query para funcionar.

//@AuthDirective - sirve para decir cuales queries necesitan login para ejecutarce

const typeDefs = gql`
  directive @AuthDirective on QUERY | FIELD_DEFINITION | FIELD

  type Auth {
    token: String
    message: String
  }

  type Message {
    message: String
  }

  type Item {
    _id: ID!
    name: String!
    amount: Float!
  }

  type User {
    _id: ID!
    name: String!
    lastName: String!
    email: String!
    items: [Item!]
  }

  type Session {
    _id: ID!
    name: String!
    isActive: Boolean!
    admin: User!
    users: [User!]
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input ItemInput {
    name: String!
    amount: Float!
  }

  type Query {
    getSession(sessionId: ID!): Session @AuthDirective
    getCurrentUserSession: Session @AuthDirective
  }

  type Mutation {
    signup(data: UserInput!): Auth
    login(email: String! password: String!): Auth
    createSession(name: String!): Session! @AuthDirective
    addUserToSession(userId: ID! sessionId: ID!): Session! @AuthDirective
    addItemToUser(userId: ID! item: ItemInput!): User! @AuthDirective
    addItemToCurrentUser(item: ItemInput!): User! @AuthDirective
    removeItemFromCurrentUser(itemId: ID!): User! @AuthDirective
  }
`;

// exporta typeDefs
module.exports = typeDefs;
