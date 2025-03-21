import { Injectable } from '@nestjs/common';
import { AlreadyRegistered } from 'src/commons/errorTypes';
import Logger from '../logger/Logger';
import { hash } from 'bcryptjs';
import * as crypto from 'crypto';

/**
 * Utility class providing common functionalities such as encryption, delay, and duplicity checks.
 */
@Injectable()
export default class Utils {
  /**
   * Constructs an instance of the Utils class.
   * @param logger - The logger instance for logging function calls and results.
   */
  constructor(private logger: Logger) {}

  /**
   * Encrypts a given password using bcrypt hashing algorithm.
   * @param password - The password to be encrypted.
   * @returns A promise that resolves to the hashed password.
   */
  async encryptPassword(password: string): Promise<string> {
    this.logger.functionCaller({ password }, 'info');
    const response = await hash(password, 8);
    this.logger.functionResult(response, 'info');
    return response;
  }

  /**
   * Encrypts a given text using AES-256-CBC encryption algorithm.
   *
   * @param text - The plain text to be encrypted.
   * @returns The encrypted text in the format of `iv:encryptedData`, where `iv` is the initialization vector and `encryptedData` is the encrypted text, both represented as hexadecimal strings.
   */
  encrypt(text: string): string {
    this.logger.functionCaller({}, 'info');

    const ivLength = parseInt(
      process.env.PROJECT_ENCRYPTION_IV_LENGTH || '0',
      10,
    );
    if (isNaN(ivLength) || ivLength <= 0) {
      throw new Error('Invalid ENCRYPTION_IV_LENGTH');
    }
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.PROJECT_ENCRYPTION_KEY || ''),
      iv,
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const response = iv.toString('hex') + ':' + encrypted.toString('hex');

    this.logger.functionResult(response, 'info');
    return response;
  }

  /**
   * Decrypts an encrypted text using AES-256-CBC algorithm.
   *
   * The encrypted text should be in the format `iv:encryptedText`, where `iv` is the initialization vector
   * and `encryptedText` is the actual encrypted data.
   *
   * @param text - The encrypted text to decrypt.
   * @returns The decrypted text as a string.
   * @throws Will throw an error if the encrypted text format is invalid.
   */
  decrypt(text: string): string {
    this.logger.functionCaller({}, 'info');
    const textParts = text.split(':');
    const ivPart = textParts.shift();
    if (!ivPart) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivPart, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.PROJECT_ENCRYPTION_KEY || ''),
      iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const response = decrypted.toString();

    this.logger.functionResult(response, 'info');
    return response;
  }

  /**
   * Compares a plain text with an encrypted text to check if they are equivalent.
   *
   * @param plainText - The plain text to compare.
   * @param encryptedText - The encrypted text to compare against.
   * @returns A boolean indicating whether the plain text matches the encrypted text.
   */
  compareEncryptText(plainText: string, encryptedText: string): boolean {
    this.logger.functionCaller({}, 'info');
    const decryptedText = this.decrypt(encryptedText);
    const isMatch = plainText === decryptedText;
    this.logger.functionResult(isMatch, 'info');
    return isMatch;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Pauses execution for a specified number of milliseconds.
   * @param ms - The number of milliseconds to sleep.
   * @returns A promise that resolves after the specified delay.
   */
  async sleep(ms: number): Promise<void> {
    this.logger.functionCaller({ ms }, 'info');
    const pro: Promise<void> = new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    this.logger.functionResult(pro, 'info');
    return pro;
  }

  /**
   * Checks for duplicity of an entity in the database based on a comparator.
   * @param entity - The entity to check for duplicity.
   * @param comparator - The criteria to compare the entity against.
   * @param model - The database model to query.
   * @returns A promise that resolves to a boolean indicating whether the entity is a duplicate.
   * @throws AlreadyRegistered - If the entity is found to be a duplicate.
   */
  async checksDuplicity(
    entity: Record<string, any>,
    comparator: Record<string, any>,
    model: {
      find: (comparator: Record<string, any>) => { exec: () => Promise<any[]> };
      modelName: string;
    },
  ): Promise<boolean> {
    this.logger.functionCaller(
      { entity, comparator, model: model.modelName },
      'info',
    );
    const findResponse = await model.find(comparator).exec();
    const duplicity = findResponse.length > 0;
    this.logger.functionResult(
      `[${duplicity}] Entity Duplicate`,
      `${duplicity ? 'error' : 'info'}`,
    );
    if (duplicity) throw new AlreadyRegistered(Object.values(comparator)[0]);
    return false;
  }
}
