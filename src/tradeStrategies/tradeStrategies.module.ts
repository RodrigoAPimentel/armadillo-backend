import { TradeStrategiesService as Service } from './tradeStrategies.service';
import { TradeStrategiesController as Controller } from './tradeStrategies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { EntitySchema } from './tradeStrategies';
import Logger from 'src/logger/Logger';
import Utils from 'src/commons/Utils';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TradeStrategies',
        schema: EntitySchema,
      },
    ]),
  ],
  controllers: [Controller],
  providers: [Service, Logger, Utils],
  exports: [Service],
})
export class TradeStrategiesModule {}
