import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import {
  GenericError,
  NotFound,
  PasswordDoesNotMatch,
} from 'src/commons/errorTypes';
import Logger from 'src/logger/Logger';
import Utils from '../commons/Utils';

import { Interface as IUser } from './users';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly model: Model<IUser>,
    private logger: Logger,
    private utils: Utils,
  ) {}

  ///// CRUD /////////////////////////////////////////////////////////////////

  /**
   * Creates a new user entity.
   * @param newEntity - The new user entity to be created.
   * @returns The created user entity.
   */
  async create(newEntity: IUser): Promise<IUser> {
    this.logger.functionCaller({ newEntity });
    await this.utils.checksDuplicity(
      newEntity,
      { email: newEntity.email },
      this.model,
    );
    newEntity.password = await this.utils.encryptPassword(newEntity.password);
    const newEntityCreated = new this.model(newEntity);
    const response = await newEntityCreated.save();
    this.logger.functionResult(response);
    return response;
  }

  /**
   * Retrieves all user entities.
   * @returns An array of all user entities.
   */
  async getAll(): Promise<IUser[]> {
    this.logger.functionCaller({});
    const all = await this.model.find().exec();
    this.logger.functionResult(all);
    return all;
  }

  /**
   * Retrieves a user entity by its ID.
   * @param id - The ID of the user entity to be retrieved.
   * @returns The user entity with the specified ID.
   * @throws NotFound - If the user entity with the specified ID is not found.
   */
  async getById(id: string): Promise<IUser> {
    this.logger.functionCaller({ id });
    const user = await this.model.findById(id).exec();
    if (!user) {
      this.logger.functionResult(`${id} Not Found!`, 'error');
      throw new NotFound(id);
    }
    this.logger.functionResult(user);
    return user;
  }

  /**
   * Retrieves a user entity by its email.
   * @param email - The email of the user entity to be retrieved.
   * @returns The user entity with the specified email.
   * @throws NotFound - If the user entity with the specified email is not found.
   */
  async getByEmail(email: string): Promise<IUser> {
    this.logger.functionCaller({ email });
    const entity = await this.model
      .findOne({ email })
      .select('+password')
      .exec();
    if (!entity) {
      this.logger.functionResult(`${email} Not Found!`, 'error');
      throw new NotFound(email);
    }
    this.logger.functionResult(entity);
    return entity;
  }

  /**
   * Updates a user entity by its ID.
   * @param id - The ID of the user entity to be updated.
   * @param entity - The updated user entity data.
   * @returns The updated user entity.
   * @throws GenericError - If the email is attempted to be modified or if the password is required but not provided.
   * @throws NotFound - If the user entity with the specified ID is not found.
   * @throws PasswordDoesNotMatch - If the provided password does not match the existing password.
   */
  async update(
    id: string,
    entity: {
      name?: string;
      role?: string;
      email?: string;
      password?: string;
      newPassword?: string;
      active?: boolean;
    },
  ): Promise<IUser> {
    this.logger.functionCaller({ id, entity });
    await this.utils.checksDuplicity(
      entity,
      { email: entity.email },
      this.model,
    );
    if (entity.email)
      throw new GenericError(
        'It is not allowed to modify the email. The email is your username',
      );
    if (entity.newPassword) {
      const oldEntity = await this.model
        .findOne({ _id: id })
        .select('+password')
        .exec();
      if (!oldEntity) throw new NotFound(id);
      if (!entity.password) throw new GenericError('Password is required');
      const validPassword = await compare(entity.password, oldEntity.password);
      if (!validPassword) throw new PasswordDoesNotMatch();
      entity.password = await this.utils.encryptPassword(entity.newPassword);
    }
    await this.model.updateOne({ _id: id }, entity).exec();
    const updatedUser = await this.getById(id);
    this.logger.functionResult(updatedUser);
    return updatedUser;
  }

  /**
   * Deletes a user entity by its ID.
   * @param id - The ID of the user entity to be deleted.
   * @returns The result of the deletion operation.
   */
  async delete(id: string) {
    this.logger.functionCaller({ id });
    const deleted = await this.model.deleteOne({ _id: id }).exec();
    this.logger.functionResult(deleted);
    return deleted;
  }
}
