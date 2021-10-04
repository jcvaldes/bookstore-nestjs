// nuestro proyecto tiene que estar preparado para que pueda
// usar multiples bases de datos por eso creo un array de Providers

import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../config/config.keys';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConnectionOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      const options = {
        ssl: Boolean(+config.get(Configuration.POSTGRES_SSL)),
        type: 'postgres' as const,
        host: config.get(Configuration.POSTGRES_HOST),
        port: Number(config.get(Configuration.POSTGRES_PORT)),
        username: config.get(Configuration.POSTGRES_USERNAME),
        password: config.get(Configuration.POSTGRES_PASSWORD),
        database: config.get(Configuration.POSTGRES_DATABASE),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as ConnectionOptions;
      return options;
    },
  }),
];
