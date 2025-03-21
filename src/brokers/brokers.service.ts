import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFound, GenericError } from 'src/commons/errorTypes';
import Logger from 'src/logger/Logger';
import Utils from '../commons/Utils';

import { Interface as IBroker } from './brokers';
import { TradeMarket } from 'src/commons/genericTypes';

@Injectable()
export class BrokersService {
  constructor(
    @InjectModel('Brokers')
    private readonly model: Model<IBroker>,
    private logger: Logger,
    private utils: Utils,
  ) {}

  ///// CRUD /////////////////////////////////////////////////////////////////

  async create(newEntity: IBroker): Promise<IBroker> {
    this.logger.functionCaller({ newEntity });
    await this.utils.checksDuplicity(
      newEntity,
      { brokerName: newEntity.brokerName },
      this.model,
    );

    newEntity = {
      ...newEntity,
      ...{
        active: true,
      },
    };

    newEntity.apiKey = this.utils.encrypt(newEntity.apiKey);
    newEntity.secretKey = this.utils.encrypt(newEntity.secretKey);

    const newEntityCreated = new this.model(newEntity);
    const response = await newEntityCreated.save();
    this.logger.functionResult(response);
    return response;
  }

  async getAll(): Promise<IBroker[]> {
    this.logger.functionCaller({});
    const all = await this.model.find().exec();
    this.logger.functionResult(all);
    return all;
  }

  async getById(id: string): Promise<IBroker> {
    this.logger.functionCaller({ id });
    const entity = await this.model
      .findById(id)
      .select('+apiKey')
      .select('+secretKey')
      .exec();
    if (!entity) {
      this.logger.functionResult(`${id} Not Found!`, 'error');
      throw new NotFound(id);
    }
    this.logger.functionResult(entity);
    return entity;
  }

  async update(
    id: string,
    newEntity: {
      name?: string;
      tradeMarket?: TradeMarket[];
      brokerName?: string;
      brokerageFee?: number;
      apiBaseUrl?: {
        main?: string;
        simulation?: string;
      };
      apiEndpoints?: Array<{
        name?: string;
        httpMethod?: string;
        endpoint?: string;
        function?: string;
        description?: string;
        observation?: string;
        params?: Array<{
          name?: string;
          key?: string;
          description?: string;
          value?: string | number;
        }>;
      }>;
      apiKey?: string;
      newApiKey?: string;
      secretKey?: string;
      newSecretKey?: string;
      others?: [
        {
          name?: string;
          key?: string;
          type?: string;
          description?: string;
          value?: string | number;
        },
      ];
      active?: boolean;
    },
  ): Promise<IBroker> {
    this.logger.functionCaller({ id, newEntity });
    if (newEntity.brokerName) {
      await this.utils.checksDuplicity(
        newEntity,
        { brokerName: newEntity.brokerName },
        this.model,
      );
    }
    const oldEntity = await this.model
      .findById(id)
      .select('+apiKey')
      .select('+secretKey')
      .exec();
    if (!oldEntity) throw new NotFound(id);
    if (newEntity.newApiKey) {
      if (!newEntity.apiKey) throw new GenericError('Old Api Key is required!');
      const validApiKey = this.utils.compareEncryptText(
        newEntity.apiKey,
        oldEntity.apiKey,
      );
      if (!validApiKey) throw new GenericError('Old Api Key Does Not Match!');
      newEntity.apiKey = this.utils.encrypt(newEntity.newApiKey);
    }
    if (newEntity.newSecretKey) {
      if (!newEntity.secretKey)
        throw new GenericError('Old Secret Key is required!');
      const validSecretKey = this.utils.compareEncryptText(
        newEntity.secretKey,
        oldEntity.secretKey,
      );
      if (!validSecretKey)
        throw new GenericError('Old Secret Key Does Not Match!');
      newEntity.secretKey = this.utils.encrypt(newEntity.newSecretKey);
    }
    // for (const key in newEntity) {
    //   if (Array.isArray(newEntity[key]) && Array.isArray(oldEntity[key])) {
    //     newEntity[key] = [
    //       ...(oldEntity[key] as unknown[]),
    //       ...(newEntity[key] as unknown[]),
    //     ];
    //   }
    // }
    await this.model.updateOne({ _id: id }, newEntity).exec();
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
