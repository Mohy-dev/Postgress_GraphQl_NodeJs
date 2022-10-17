const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const { typeDefs } = require('./graphql/schema');
const { Mutation } = require('./graphql/mutation');
const { Query } = require('./graphql/query');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
