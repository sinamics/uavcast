import 'reflect-metadata';
import winston from 'winston';
import SystemLogger from './logger';
SystemLogger.initilize();
import path from 'path';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MapResovler } from './resolvers/MapResovler';
import { MavlinkResolver } from './resolvers/MavlinkResolver';
import { UAVcastResovler } from './resolvers/UavcastResolver';
import { VpnResolver } from './resolvers/VpnResolver';
import { KernelResolver } from './resolvers/KernelResolver';
import compression from 'compression';
import dotv from 'dotenv';
import cors from 'cors';
import PubSub, { setConStaus } from './utils/pubsub';
import { ModemResolver } from './resolvers/ModemResolver';
import { Supervisor } from './resolvers/SupervisorResolver';
import { ApplicationResolver } from './resolvers/ApplicationResolver';
import { EndpointResolver } from './resolvers/Endpoint';
import { FlightControllerResolver } from './resolvers/FlightControllerResolver';
import { Logviewer } from './resolvers/Logger';
import { CameraResolver } from './resolvers/CameraResolver';
import { createTypeormConn } from './createTypeormCon';
import AppLogger from './logger/ulog';
import { shouldSeed } from './seeds';
import { supervisor } from './utils/supervisor';
import { fileDownload } from './api/download-logfile';
import { postUpdateActions } from './utils/postUpdateActions';
import { graphqlUploadExpress } from 'graphql-upload';
import { backupDatabase } from './api/download-sqlite';
import { BackupRestoreResolver } from './resolvers/BackupRestore';

dotv.config();
const LogServer = winston.loggers.get('server');
// hack to get unix root.
// const unixRootPath = path.join(process.cwd(), '../../../../../../');

// process.on('SIGTERM', () => process.exit());
process
  .on('uncaughtException', function (exception) {
    LogServer.error({ message: exception.stack, path: __filename });
    process.exit();
    // ServLog.getLogger().error(exception);
    // console.log(exception); // to see your exception details in the console
    // if you are on production, maybe you can send the exception details to your
    // email as well ?
  })
  .on('unhandledRejection', async (reason: any, promise: any) => {
    // console.error(event.message, 'Unhandled Rejection at Promise', path);
    console.error('Unhandled Rejection at Promise', path); // eslint-disable-line no-console
    LogServer.error({ message: reason.message, data: promise, path: __filename });
    process.exit();
    // ServLog.getLogger().error(reason);
  });
const server = async () => {
  createTypeormConn().then(() => {
    // ************ Start timer ****************
    AppLogger.constructor();

    // ************ Seed database (first run) ****************
    shouldSeed();

    // ************ Check if application has been updated ****************
    postUpdateActions();
  });
  const app = express();

  app.use(cors());

  if (process.env.NODE_ENV === 'production') {
    console.log('Running Production Server port:' + process.env.SERVER_PORT); // eslint-disable-line no-console
    app.use(compression());
    app.use(express.static(path.join(__dirname, '../../frontend/build')));

    // Route all requests to index
    app.get('/*', function (_, res) {
      res.sendFile(path.join(__dirname, '../../frontend/build/index.html'), function (err) {
        if (err) {
          res.status(500).send(err);
        }
      });
    });
  }

  const apolloServer = new ApolloServer({
    uploads: false,
    schema: await buildSchema({
      resolvers: [
        MapResovler,
        UAVcastResovler,
        VpnResolver,
        KernelResolver,
        MavlinkResolver,
        ModemResolver,
        ApplicationResolver,
        EndpointResolver,
        FlightControllerResolver,
        Logviewer,
        CameraResolver,
        Supervisor,
        BackupRestoreResolver
      ],
      validate: false
    }),
    subscriptions: {
      path: '/subscriptions',
      onConnect: () => {
        setConStaus(true);
      },
      onDisconnect: () => {
        setConStaus(false);
      }
      // other options and hooks, like `onConnect`
    },
    context: ({ req, res }) => ({ req, res, PubSub }),
    playground: {
      settings: {
        'request.credentials': 'include'
      }
    }
  });

  app.use(graphqlUploadExpress());
  fileDownload(app);
  backupDatabase(app);

  apolloServer.applyMiddleware({ app, cors: false });
  const httpServer = http.createServer(app);
  // you need this to get websocket connection
  apolloServer.installSubscriptionHandlers(httpServer);

  const port = process.env.SERVER_PORT || 80;
  httpServer.listen(port, () => {
    LogServer.info({ message: `started at http://localhost:${port}/graphql`, path: 'server' });
  });

  // getModemInfo();
  supervisor();
};

server();
