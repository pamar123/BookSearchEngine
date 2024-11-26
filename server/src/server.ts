import express from 'express';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';
import type { RequestHandler, Request, Response, NextFunction } from 'express-serve-static-core';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  includeStacktraceInErrorResponses: true,
  formatError: (formattedError, error) => {
    console.error('GraphQL Error:', {
      message: formattedError.message,
      locations: formattedError.locations,
      path: formattedError.path,
      extensions: formattedError.extensions,
    });
    return formattedError;
  },
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    }),
    expressMiddleware(server, {
      context: authMiddleware
    })
  );

  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer().catch((err) => console.error('Error starting server:', err));