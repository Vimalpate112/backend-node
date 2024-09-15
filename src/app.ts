import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import https from 'https';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolver';
import apiRoutes from "./routes/index.route"
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger_output.json';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const httpPort = process.env.HTTP_PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3010;
const environment = process.env.NODE_ENV;
const mongoDBURL = process.env.MONGO_URL;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json({ limit: '3mb' }));

app.use('/api/v1', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  return res.json({
    message: 'server running successfully',
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err: any, req: Request, res: Response, next: NextFunction) => { });

async function startApplication() {
  await mongoose.connect(mongoDBURL, {});

  //graphql server
  const graphqlServer = new ApolloServer({ typeDefs, resolvers });
  await graphqlServer.start();
  app.use('/graphql', expressMiddleware(graphqlServer));

  if (environment === 'developement') {
    const httpServer = http.createServer(app);
    httpServer.listen(httpPort, () => {
      console.log(`http server running at localhost:${httpPort}`);
    });
  } else {
    const httpsServer = https.createServer(
      {
        key: fs.readFileSync('/key.pem'),
        cert: fs.readFileSync('/certificate.pem'),
      },
      app,
    );
    httpsServer.listen(httpsPort, () => {
      console.log(`https server running at localhost:${httpsPort}`);
    });
  }
}

startApplication();
