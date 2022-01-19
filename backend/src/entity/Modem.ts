import { Entity, Check, PrimaryColumn, Column, getRepository } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class Modem {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field()
  @Column({ type: Boolean, default: false, nullable: false })
  enableModem: boolean;

  @Field()
  @Column({ type: String, default: 'hilink', nullable: false })
  modemType: string;

  @Field()
  @Column({ type: Boolean, default: false, nullable: false })
  modemInformation: boolean;

  @Field()
  @Column({ type: String, default: 'eth1' })
  modemInterface: string;

  @Field()
  @Column({ type: String, default: 'cdc-wdm0', nullable: false })
  internalAddress: string;

  @Field()
  @Column({ type: String, default: 0, nullable: false })
  pinCode: string;

  @Field()
  @Column({ type: String, default: '', nullable: false })
  username: string;

  @Field()
  @Column({ type: String, default: '', nullable: false })
  password: string;
}

export const getModemRepository = () => {
  return getRepository<Modem>(Modem);
};
