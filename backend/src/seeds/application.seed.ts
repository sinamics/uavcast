import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Application } from '../entity/Application';

export class CreateApplication implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Application)
      .values([{ ensure: 1, hasBeenUpdated: false, webPort: 80 }])
      .execute();
  }
}
