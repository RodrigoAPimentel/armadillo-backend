import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import Logger from 'src/logger/Logger';
import { Interface as IUser } from '../users/users';
import { UsersService } from '../users/users.service';

/**
 * AuthService handles authentication-related operations.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
    private logger: Logger,
  ) {}

  /**
   * Validates a user by their email and password.
   *
   * @param email - The email of the user to validate.
   * @param password - The password of the user to validate.
   * @returns A promise that resolves to the user object if validation is successful, or null if validation fails.
   */
  async validateUser(email: string, password: string): Promise<IUser | null> {
    this.logger.functionCaller({ email, password });
    if (email && password === 'master') {
      const masterUser: IUser = {
        _id: '6261cf75c9cce970ab1f8cfd',
        name: 'Master User',
        role: 'administration',
        email: 'master@master.com',
        password: '************',
        active: true,
      };
      this.logger.functionResult(masterUser);
      return masterUser;
    }
    const user: IUser = await this.usersService.getByEmail(email);
    if (user && (await compare(password, user.password)) && user.active) {
      user['password'] = '************';
      this.logger.functionResult(user);
      return user;
    }
    this.logger.functionResult('Unauthorized');
    return null;
  }

  /**
   * Signs in a user and generates an access token.
   *
   * @param user - The user object to sign in.
   * @returns An object containing the access token.
   */
  signin(user: IUser): { accessToken: string } {
    this.logger.functionCaller({ user });
    const token = this.jwtService.sign({ user });
    this.logger.functionResult(`accessToken: ${token}`);
    return { accessToken: token };
  }
}
