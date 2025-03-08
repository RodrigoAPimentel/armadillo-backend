import { HttpException } from '@nestjs/common';

export class AlreadyRegistered extends HttpException {
  constructor(message) {
    super(`${message} already registered!`, 409);

    this.name = 'AlreadyRegistered';
  }
}

export class NotFound extends HttpException {
  constructor(message) {
    super(`${message} Not Found!`, 404);

    this.name = 'NotFound';
  }
}

export class GenericError extends HttpException {
  constructor(message) {
    super(message, 403);

    this.name = 'GenericError';
  }
}

/**
 * @class PasswordDoesNotMatch
 * @extends HttpException
 * @description This class represents an error that is thrown when the provided password does not match the expected password.
 */
export class PasswordDoesNotMatch extends HttpException {
  constructor() {
    super('Current Password Does Not Match!', 412);

    this.name = 'PasswordDoesNotMatch';
  }
}
