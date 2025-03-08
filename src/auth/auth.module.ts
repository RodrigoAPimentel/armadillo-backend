import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import Logger from 'src/logger/Logger';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.PROJECT_AUTH_SECRET,
      signOptions: { expiresIn: process.env.PROJECT_AUTH_EXPIRESIN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, Logger],
  exports: [AuthService],
})
export class AuthModule {}
