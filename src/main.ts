import * as apm from 'elastic-apm-node'; // if using esModuleInterop:false

apm.start({
  serviceName: process.env.PROJECT_NAME,
  serverUrl: `http://${process.env.ELK_APM_HOST}`,
  environment: process.env.NODE_ENV,
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(
    process.env.PROJECT_BACKEND_PORT
      ? parseInt(process.env.PROJECT_BACKEND_PORT)
      : 3000,
  );
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
