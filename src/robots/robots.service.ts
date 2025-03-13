import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFound } from 'src/commons/errorTypes';
import Logger from 'src/logger/Logger';
import Utils from '../commons/Utils';

import { Interface as IRobot } from './robots';

@Injectable()
export class RobotsService {
  constructor(
    @InjectModel('Robots') private readonly model: Model<IRobot>,
    private logger: Logger,
    private utils: Utils,
  ) {}

  ///// CRUD /////////////////////////////////////////////////////////////////

  async create(newEntity: IRobot): Promise<IRobot> {
    this.logger.functionCaller({ newEntity });
    await this.utils.checksDuplicity(
      newEntity,
      { name: newEntity.name },
      this.model,
    );

    newEntity = {
      ...newEntity,
      ...{
        isOpened: {
          opened: false,
          lastUpdate: '-',
          orderId: '-',
        },
        isRunning: {
          running: false,
          started: '-',
          ended: '-',
        },
        stopRobot: false,
        active: true,
        otherParams: Array.isArray(newEntity.otherParams)
          ? newEntity.otherParams
          : typeof newEntity.otherParams === 'string'
            ? JSON.parse(newEntity.otherParams)
            : [],
      },
    };

    const newEntityCreated = new this.model(newEntity);
    const response = await newEntityCreated.save();
    this.logger.functionResult(response);
    return response;
  }

  async getAll(): Promise<IRobot[]> {
    this.logger.functionCaller({});
    const all = await this.model.find().exec();
    this.logger.functionResult(all);
    return all;
  }

  async getById(id: string): Promise<IRobot> {
    this.logger.functionCaller({ id });
    const user = await this.model.findById(id).exec();
    if (!user) {
      this.logger.functionResult(`${id} Not Found!`, 'error');
      throw new NotFound(id);
    }
    this.logger.functionResult(user);
    return user;
  }

  async update(id: string, entity: IRobot): Promise<IRobot> {
    this.logger.functionCaller({ id, entity });
    await this.utils.checksDuplicity(entity, { name: entity.name }, this.model);
    await this.model.updateOne({ _id: id }, entity).exec();
    const updatedEntity = await this.getById(id);
    this.logger.functionResult(updatedEntity);
    return updatedEntity;
  }

  async delete(id: string) {
    this.logger.functionCaller({ id });
    const deletedEntity = await this.model.deleteOne({ _id: id }).exec();
    this.logger.functionResult(deletedEntity);
    return deletedEntity;
  }
}
