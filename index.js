// apollo-server setup
const {
    ApolloServer
} = require('apollo-server-express');
const {
    ApolloServerPluginDrainHttpServer
} = require('apollo-server-core');
const {
    SubscriptionServer
} = require('subscriptions-transport-ws');

// graphql imports
const {
    execute,
    subscribe
} = require('graphql');
const {
    makeExecutableSchema
} = require('@graphql-tools/schema');

// node express imports
const express = require('express');
const {
    createServer
} = require('http');

// mongodb import with dotnet
const mongoose = require('mongoose');
require('dotenv').config();

// Schema type and resolvers
const typeDefs = require('./GraphQL/typeDefs');
const resolvers = require('./GraphQL/Resolvers');

// Required logic for integrating with Express
// This `app` is the returned value from `express()`.
const app = express();
const httpServer = createServer(app);

// resolving schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const server = new ApolloServer({
    schema,
    plugins: [{
        async serverWillStart() {
            return {
                async drainServer() {
                    subscriptionServer.close();
                }
                // ApolloServerPluginDrainHttpServer({
                //     httpServer
                // })
            }
        }
    }],
    context: ({
        req
    }) => ({
        req
    })
});

// creating subscriptions server
const subscriptionServer = SubscriptionServer.create({
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe
}, {
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // This `server` is the instance returned from `new ApolloServer`.
    path: server.graphqlPath
});

async function startApolloServer(server, app, httpServer) {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("MongoDB Connected");

    await server.start();
    server.applyMiddleware({
        app
    });

    await new Promise(resolvers => httpServer.listen({
        port: process.env.PORT || 5000,
        resolvers
    }));
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}
startApolloServer(server, app, httpServer);