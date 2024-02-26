import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Room } from './entity/Room';

export const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'src/data/db.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, Room],
});
