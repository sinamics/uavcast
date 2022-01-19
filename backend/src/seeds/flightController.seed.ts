import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { FlightController } from '../entity/FlightController';

export class CreateFlightController implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(FlightController)
      .values([
        {
          ensure: 1,
          controller: 'apm',
          protocol: 'udp',
          connectionType: 'usb',
          internalAddress: '/dev/ttyACM0',
          baudRate: '57600',
          tcpPort: '5790',
          binFlightLog: false
        }
      ])
      .execute();
  }
}
