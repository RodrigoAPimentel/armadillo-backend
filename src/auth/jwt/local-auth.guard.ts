/**
 * @fileoverview This file contains the definition of the LocalAuthGuard class,
 * which extends the AuthGuard class with the 'local' strategy.
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class LocalAuthGuard
 * @extends AuthGuard
 *
 * @description
 * This guard is used to protect routes using the 'local' authentication strategy.
 * It extends the AuthGuard class provided by @nestjs/passport.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
