import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import Logger from 'src/logger/Logger';

/**
 * LocalStrategy class that extends PassportStrategy.
 * This strategy is used to validate user credentials.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for LocalStrategy.
   * @param authService - The authentication service used to validate users.
   * @param logger - The logger service used to log function calls and results.
   */
  constructor(
    private authService: AuthService,
    private logger: Logger,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validates the user credentials.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to the user if validation is successful.
   * @throws UnauthorizedException if the user credentials are invalid.
   */
  async validate(email: string, password: string): Promise<any> {
    this.logger.functionCaller({ email });
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    this.logger.functionResult(user);
    return user;
  }
}
