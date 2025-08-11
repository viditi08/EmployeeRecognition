import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import resolvers from '../graphql/resolvers';
import { users, teams, recognitions, notifications } from '../data/dummyData';
import { PubSub } from 'graphql-subscriptions';
import { SlackService } from '../services/slackService';

const typeDefs = readFileSync(path.join(__dirname, './schema/index.graphql'), 'utf8');
const pubsub = new PubSub();

// Configure Slack integration
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
if (SLACK_WEBHOOK_URL) {
  SlackService.setWebhookUrl(SLACK_WEBHOOK_URL);
  console.log('🔗 Slack integration enabled');
} else {
  console.log('📝 Slack integration not configured (set SLACK_WEBHOOK_URL in .env to enable)');
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Set up WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async () => ({
        users,
        teams,
        recognitions,
        notifications,
        currentUser: users[2], // Charlie Brown (Manager)
        pubsub,
      }),
    },
    wsServer
  );

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  // Set up middleware in the correct order
  app.use(cors());
  app.use(express.json());
  
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({
        users,
        teams,
        recognitions,
        notifications,
        currentUser: users[2], // Charlie Brown (Manager)
        pubsub,
      }),
    })
  );

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`👤 Current user: Charlie Brown (Manager)`);
    console.log(`📊 Analytics: Available for Managers/HR/Admin`);
    console.log(`🔔 Real-time: WebSocket subscriptions enabled`);
    if (SLACK_WEBHOOK_URL) {
      console.log(`🔗 Slack: Integration active`);
    } else {
      console.log(`📝 Slack: Set SLACK_WEBHOOK_URL in .env to enable`);
    }
  });
}

startServer().catch(console.error);
