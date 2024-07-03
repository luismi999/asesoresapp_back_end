import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RenewTokenMiddleware } from 'src/middleware/renewToken.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigModule],
  imports: [
    // TypeORM
    TypeOrmModule.forFeature([User]),
    // Tokens settings
    JwtModule.register({
      secret: 'asesoresapp',
      signOptions: {
        expiresIn: '10m'
      }
    })
  ],
  exports: [AuthService]
})
export class AuthModule {

   /* ----------------------------------------------- Middleware ---------------------------------------------- */
   configure( consumer: MiddlewareConsumer ){
    consumer
    .apply( RenewTokenMiddleware )
    .forRoutes('auth/renew')
  }
}
