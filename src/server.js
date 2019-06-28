// configura las variables de entorno para development
require('dotenv').config();

// importacion de paquetes.
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require("mongoose");

// parametros de conexion a la base de datos
mongoose.connect(
  process.env.URL_DATABASE,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  }
);

// crea la conexion a la base de datos
const mongo = mongoose.connection;
// listeners, 
mongo.on('error', console.error.bind(console, 'Error de conexion'));
mongo.on('open', () => console.log('Conectado !'));


const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// typeDefs, esquema de graphql que define los datos que seran almacenados en la aplicacion
// y la logica de negocio (queries y mutations)
// Queries -- GET -- pide datos
// Mutations -- PUT, PATCH, DELETE, POST -- sirven para crear datos, eliminarlos y actualizarlos
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

// Resolvers funciones que son la logica del negocio y son acciones que define como se
// comportan las queries y las mutations
const resolvers = {
  Query: {
    books: () => books,
  },
};

// instancia de un nuevo servidor de apollo server
// para iniciarlo es necesario especificar los typeDefs y los resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// levanta el servidor
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});