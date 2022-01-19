import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Modem } from '../entity/Modem';

export class CreateModem implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Modem)
      .values([{ ensure: 1, enableModem: false, modemInformation: false, modemInterface: 'eth1', internalAddress: 'cdc-wdm0' }])
      .execute();
  }
}
