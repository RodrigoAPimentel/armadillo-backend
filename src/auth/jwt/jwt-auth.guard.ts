import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that handles JWT authentication.
 *
 * This guard extends the built-in `AuthGuard` from `@nestjs/passport` with the 'jwt' strategy.
 * It is used to protect routes by ensuring that the request contains a valid JWT token.
 *
 * @see AuthGuard
 */
@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {}
