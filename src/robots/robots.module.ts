import { RobotsService as Service } from './robots.service';
import { RobotsController as Controller } from './robots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { EntitySchema } from './robots';
import Logger from 'src/logger/Logger';
import Utils from 'src/commons/Utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Robots',
        schema: EntitySchema,
      },
    ]),
  ],
  controllers: [Controller],
  providers: [Service, Logger, Utils],
  exports: [Service],
})
export class RobotsModule {}
