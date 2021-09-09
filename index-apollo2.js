// apollo-server setup
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./GraphQL/typeDefs');
const resolvers = require('./GraphQL/Resolvers');

const pubsub = new PubSub();

// creating apollo object
const server = (new ApolloServer({
    typeDefs,
    resolvers,
    cors: true,
    context: ({ req }) => ({ req, pubsub })
}));

// creating server
const serve = async () => {
    try {
        const { url, port } = await server.listen({
            port: process.env.PORT || 5000
        });
        await mongoose.connect(process.env.CONNECTION_STRING);

        console.log(`🚀 Server ready at ${url} on PORT : ${port}
Connected to MongoDB`);
    } catch (error) {
        console.error(error);
    }
}
serve();