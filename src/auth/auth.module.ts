import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './controllers/auth.controller';
import { TestController } from './controllers/test.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60, // time window in seconds
      limit: 5, // maximum number of requests within ttl
    }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, TestController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {} 