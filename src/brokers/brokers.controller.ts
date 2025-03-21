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

import { Interface as IBroker } from './brokers';
import { BrokersService } from './brokers.service';
import { JWTAuthGuard } from '../auth/jwt/jwt-auth.guard';
import Logger from 'src/logger/Logger';

@UseGuards(JWTAuthGuard)
@Controller('brokers')
export class BrokersController {
  constructor(
    private readonly service: BrokersService,
    private logger: Logger,
  ) {}

  @Post()
  async create(@Body() entity: IBroker) {
    this.logger.functionCaller({ entity }, 'info');
    const newEntity = await this.service.create(entity);
    this.logger.functionResult(newEntity, 'info');
    return newEntity;
  }

  @Get()
  async getAll() {
    this.logger.functionCaller({}, 'info');
    const allEntities = await this.service.getAll();
    this.logger.functionResult(allEntities, 'info');
    return allEntities;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    this.logger.functionCaller({ id }, 'info');
    const entity = await this.service.getById(id);
    this.logger.functionResult(entity, 'info');
    return entity;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() entity: IBroker) {
    this.logger.functionCaller({ id, entity }, 'info');
    const updated = await this.service.update(id, entity);
    this.logger.functionResult(updated, 'info');
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    this.logger.functionCaller({ id }, 'info');
    const deleteResponse = await this.service.delete(id);
    let result = { statusCode: 0, message: '' };
    switch (deleteResponse.deletedCount) {
      case 0:
        result = { statusCode: 404, message: `[${id}] not found` };
        break;
      case 1:
        result = { statusCode: 200, message: `[${id}] deleted successfully` };
        break;
    }
    this.logger.functionResult(result, 'info');
    return result;
  }
}
