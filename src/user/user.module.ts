/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryAdapter } from './adapter/db/user-repository.adapter';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepositoryAdapter])],
  providers: [UserService],
})
export class UserModule {}
