import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { APP_INTERCEPTOR } from '@nestjs/core';

import Logger from './logger/Logger';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { winstonConfig } from './logger/winston.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RobotsModule } from './robots/robots.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?authSource=admin`,
    ),
    WinstonModule.forRoot(winstonConfig),

    AuthModule,
    UsersModule,
    RobotsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    Logger,
  ],
})
export class AppModule {}
