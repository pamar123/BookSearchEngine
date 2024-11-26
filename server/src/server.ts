import express from 'express';
import type { Request, Response } from 'express-serve-static-core';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { productionConfig } from './config/production.js';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  includeStacktraceInErrorResponses: !isProd,
});

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const corsOptions = isProd 
    ? {
        origin: productionConfig.allowedOrigins,
        credentials: true
      }
    : {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true
      };

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    expressMiddleware(server, {
      context: authMiddleware
    })
  );

  if (isProd) {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (req: Request, res: Response) => {
      res.sendFile(
        path.join(__dirname, '../../client/dist/index.html'),
        (err: Error | null) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading application');
          }
        }
      );
    });
  }

  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer().catch((err) => console.error('Error starting server:', err));