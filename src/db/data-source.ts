import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import ormConfig from 'src/config/orm.config';
import { join } from 'path';

ConfigModule.forRoot({
  load: [ormConfig],
});

export default new DataSource({
  ...ormConfig(),
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
