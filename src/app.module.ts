import { getMailerConfig } from './config/mailer.config';
import { UserController } from './interface/http/user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { UserRepository } from './modules/user/user.repository';
import { UserService } from './app/service/user.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './app/service/auth.service';
import { AuthController } from './interface/http/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService),
    }),
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getMailerConfig(configService),
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserRepository,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
