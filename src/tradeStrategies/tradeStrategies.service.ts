import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFound } from 'src/commons/errorTypes';
import Logger from 'src/logger/Logger';
import Utils from '../commons/Utils';

import { Interface as ITradeStrategies } from './tradeStrategies';

@Injectable()
export class TradeStrategiesService {
  constructor(
    @InjectModel('TradeStrategies')
    private readonly model: Model<ITradeStrategies>,
    private logger: Logger,
    private utils: Utils,
  ) {}

  ///// CRUD /////////////////////////////////////////////////////////////////

  async create(newEntity: ITradeStrategies): Promise<ITradeStrategies> {
    this.logger.functionCaller({ newEntity });
    await this.utils.checksDuplicity(
      newEntity,
      { acronym: newEntity.acronym },
      this.model,
    );

    newEntity = {
      ...newEntity,
      ...{
        active: true,
      },
    };

    const newEntityCreated = new this.model(newEntity);
    const response = await newEntityCreated.save();
    this.logger.functionResult(response);
    return response;
  }

  async getAll(): Promise<ITradeStrategies[]> {
    this.logger.functionCaller({});
    const all = await this.model.find().exec();
    this.logger.functionResult(all);
    return all;
  }

  async getById(id: string): Promise<ITradeStrategies> {
    this.logger.functionCaller({ id });
    const entity = await this.model.findById(id).exec();
    if (!entity) {
      this.logger.functionResult(`${id} Not Found!`, 'error');
      throw new NotFound(id);
    }
    this.logger.functionResult(entity);
    return entity;
  }

  async update(
    id: string,
    entity: ITradeStrategies,
  ): Promise<ITradeStrategies> {
    this.logger.functionCaller({ id, entity });
    await this.utils.checksDuplicity(
      entity,
      { acronym: entity.acronym },
      this.model,
    );
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
