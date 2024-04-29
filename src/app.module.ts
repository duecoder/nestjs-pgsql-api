import { UserController } from './user/user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UserModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  // exports: [UserService],  // Exporte para que outros módulos possam usar
})
export class AppModule {}
