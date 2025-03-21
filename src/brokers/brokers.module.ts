import { BrokersService as Service } from './brokers.service';
import { BrokersController as Controller } from './brokers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { EntitySchema } from './brokers';
import Logger from 'src/logger/Logger';
import Utils from 'src/commons/Utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Brokers',
        schema: EntitySchema,
      },
    ]),
  ],
  controllers: [Controller],
  providers: [Service, Logger, Utils],
  exports: [Service],
})
export class BrokersModule {}
