import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { Interface as User } from './users';
import { UsersService } from './users.service';
import { JWTAuthGuard } from '../auth/jwt/jwt-auth.guard';
import Logger from 'src/logger/Logger';

/**
 * UsersController handles CRUD operations for user entities.
 */
@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private logger: Logger,
  ) {}

  /**
   * Creates a new user entity.
   * @param entity - The user entity to create.
   * @returns The newly created user entity.
   */
  @Post()
  async create(@Body() entity: User) {
    this.logger.functionCaller({ entity }, 'info');
    const newEntity = await this.service.create(entity);
    this.logger.functionResult(newEntity, 'info');
    return newEntity;
  }

  /**
   * Retrieves all user entities.
   * @returns An array of all user entities.
   */
  @Get()
  async getAll() {
    this.logger.functionCaller({}, 'info');
    const allEntities = await this.service.getAll();
    this.logger.functionResult(allEntities, 'info');
    return allEntities;
  }

  /**
   * Retrieves a user entity by its ID.
   * @param id - The ID of the user entity to retrieve.
   * @returns The user entity with the specified ID.
   */
  @Get(':id')
  async getById(@Param('id') id: string) {
    this.logger.functionCaller({ id }, 'info');
    const entity = await this.service.getById(id);
    this.logger.functionResult(entity, 'info');
    return entity;
  }

  /**
   * Updates a user entity by its ID.
   * @param id - The ID of the user entity to update.
   * @param entity - The updated user entity data.
   * @returns The updated user entity.
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() entity) {
    this.logger.functionCaller({ id, entity }, 'info');
    const updated = await this.service.update(id, entity);
    this.logger.functionResult(updated, 'info');
    return updated;
  }

  /**
   * Deletes a user entity by its ID.
   * @param id - The ID of the user entity to delete.
   * @returns A message indicating the result of the deletion.
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.logger.functionCaller({ id }, 'info');
    const deleteResponse = await this.service.delete(id);
    let deletedResult = '';
    switch (deleteResponse.deletedCount) {
      case 0:
        deletedResult = `[${id}] not found`;
        break;
      case 1:
        deletedResult = `[${id}] deleted successfully`;
        break;
    }
    this.logger.functionResult(deletedResult, 'info');
    return deletedResult;
  }
}
