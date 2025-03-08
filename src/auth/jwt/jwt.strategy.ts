import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import Logger from 'src/logger/Logger';

/**
 * JwtStrategy class that extends PassportStrategy to handle JWT authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor for JwtStrategy.
   *
   * @param logger - Logger instance for logging purposes.
   */
  constructor(private logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.PROJECT_AUTH_SECRET,
    });
  }

  /**
   * Validates the JWT payload.
   *
   * @param payload - The JWT payload containing user information.
   * @returns An object containing the user ID and username.
   */
  validate(payload: { _id: string; user: string }) {
    this.logger.functionCaller({ payload });
    const response = { id: payload._id, user: payload.user };
    this.logger.functionResult(response);
    return response;
  }
}
