const {ApolloServer} = require('apollo-server');
const {typeDefs, resolvers: jsonScalar} = require('./schema');
const resolvers = require('./resolvers');
const server = new ApolloServer({typeDefs, resolvers});

server.listen({port:4000}).then(({url}) => {
    console.log(`Server at ${url}`);
});