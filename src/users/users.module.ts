import { UsersService as Service } from './users.service';
import { UsersController as Controller } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { EntitySchema } from './users';
import Logger from 'src/logger/Logger';
import Utils from 'src/commons/Utils';

/**
 * UsersModule is a module that provides the necessary configurations for the Users feature.
 *
 * @module UsersModule
 *
 * @description
 * This module imports the MongooseModule to define the Users schema, and provides the necessary
 * controllers, providers, and exports for the Users feature.
 *
 * @imports
 * - MongooseModule: Used to define the Users schema.
 *
 * @controllers
 * - Controller: Handles incoming requests and returns responses.
 *
 * @providers
 * - Service: Provides business logic for the Users feature.
 * - Logger: Logs information for debugging and monitoring.
 * - Utils: Provides utility functions for the Users feature.
 *
 * @exports
 * - Service: Exports the Service provider to be used in other modules.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: EntitySchema,
      },
    ]),
  ],
  controllers: [Controller],
  providers: [Service, Logger, Utils],
  exports: [Service],
})
export class UsersModule {}
