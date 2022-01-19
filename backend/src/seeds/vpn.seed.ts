import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Vpn } from '../entity/Vpn';

export class CreateVpn implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Vpn)
      .values([{ ensure: 1, enableVpn: false }])
      .execute();
  }
}
