import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Camera } from '../entity/Camera';

export class CreateCamera implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Camera)
      .values([{ ensure: 1, enableCamera: true, protocol: 'udp' }])
      .execute();
  }
}
