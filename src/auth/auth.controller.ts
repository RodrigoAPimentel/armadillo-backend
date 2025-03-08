import {
  Controller as CommonController,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import Logger from 'src/logger/Logger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './jwt/local-auth.guard';

/**
 * AuthController handles authentication-related requests.
 */
@UseGuards(LocalAuthGuard)
@CommonController('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private logger: Logger,
  ) {}

  /**
   * Handles the signin request.
   *
   * @param req - The request object containing user information.
   * @returns An object containing the access token.
   */
  @Post('signin')
  signin(@Request() req: any): { accessToken: string } {
    this.logger.functionCaller({}, 'info');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { accessToken } = this.service.signin(req.user);
    this.logger.functionResult({ accessToken }, 'info');
    return { accessToken };
  }
}
