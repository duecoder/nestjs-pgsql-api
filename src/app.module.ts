import { UserController } from './interface/http/user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { UserRepository } from './modules/user/user.repository';
import { UserService } from './app/service/user.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './app/service/auth.service';
import { AuthController } from './interface/http/auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, UserRepository, AuthService],
})
export class AppModule {}
