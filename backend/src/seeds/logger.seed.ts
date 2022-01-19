import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Logger } from '../entity/Logger';

export class CreateLogger implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Logger)
      .values([{ ensure: 1, cellSignal: true, altitude: true, datetime: 0, satellites: true, resolution: 1.0 }])
      .execute();
  }
}
