import { Entity, Check, PrimaryColumn, Column, getRepository } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class Vpn {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field(() => ID)
  @Column({ type: Number, default: 1 })
  id: number;

  @Field()
  @Column({ type: Boolean, default: false, nullable: false })
  enableVpn: boolean;

  @Field()
  @Column({ type: String, default: '', nullable: false })
  networkId: string;

  @Field()
  @Column({ type: String, default: 'zerotier', nullable: false })
  serviceProvider: string;

  @Field()
  @Column({ type: String, default: '', nullable: false })
  username: string;

  @Field()
  @Column({ type: String, default: '', nullable: false })
  password: string;
}

export const getVpnRepository = () => {
  return getRepository<Vpn>(Vpn);
};
