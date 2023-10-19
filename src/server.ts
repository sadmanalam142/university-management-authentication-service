import mongoose from 'mongoose';
import config from './config/index';
import app from './app';
import { Server } from 'http';
import { RedisClient } from './shared/redis';
import subscribeToEvents from './app/events';

process.on('uncaughtException', error => {
  console.log('Uncaught exception is detected.....');
  console.log(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });

    await mongoose.connect(config.database_url as string);
    console.log('Database Connected Successfull');

    server = app.listen(config.port, () => {
      console.log(`Application is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Failed to connect database', error);
  }

  process.on('unhandledRejection', error => {
    console.log(
      'Unhandled rejection is detected, we are closing our server.....',
      error,
    );
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERN is recieved');
  if (server) {
    server.close();
  }
});

module.exports = app;
