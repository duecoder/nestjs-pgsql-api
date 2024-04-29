import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'nest-user',
  password: 'nest-pass',
  database: 'nest-db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
