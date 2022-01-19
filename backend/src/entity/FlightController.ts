import { Entity, Check, PrimaryColumn, Column, getRepository } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class FlightController {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field(() => ID)
  @Column({ type: Number, default: 1 })
    id: number;

  @Field()
  @Column({ type: String, default: 'apm', nullable: false })
    controller: string;

  @Field()
  @Column({ type: String, default: 'udp', nullable: false })
    protocol: string;

  @Field()
  @Column({ type: String, default: 'usb', nullable: false })
    connectionType: string;

  @Field()
  @Column({ type: String, default: '/dev/ttyACM0', nullable: false })
    internalAddress: string;

  @Field()
  @Column({ type: String, default: '57600', nullable: false })
    baudRate: string;

  @Field()
  @Column({ type: String, default: '5790', nullable: false })
    tcpPort: string;

  @Field()
  @Column({ type: Boolean, default: false, nullable: false })
    binFlightLog: boolean;
}

export const getFlightControllerRepository = () => {
  return getRepository<FlightController>(FlightController);
};
