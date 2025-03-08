// import 'elastic-apm-node/start.js'; // Elasticsearch apm-server agent
import * as apm from 'elastic-apm-node';

apm.start({
  serviceName: process.env.PROJECT_BACKEND_NAME,
  serverUrl: `http://${process.env.ELK_APM_HOST}`,
  environment: `${process.env.NODE_ENV}`,
  // logLevel: process.env.ELK_APM_LOG_LEVEL as apm.LogLevel,
  logLevel: 'fatal',
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';

/**
 * Initializes and starts the NestJS application.
 *
 * This function creates a NestJS application instance with a custom logger,
 * enables CORS, and starts the application on the specified port.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application has started.
 */
async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);

  const app = await NestFactory.create(AppModule, { logger });

  app.enableCors();

  await app.listen(
    process.env.PROJECT_BACKEND_PORT ? process.env.PROJECT_BACKEND_PORT : 3000,
  );
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
