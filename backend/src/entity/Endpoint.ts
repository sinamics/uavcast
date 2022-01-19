import { Entity, Column, PrimaryGeneratedColumn, getRepository } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
export class Endpoint {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'boolean', default: false, nullable: false })
  telemEnable: boolean;

  @Field()
  @Column({ type: 'boolean', default: true, nullable: false })
  moduleActive: boolean;

  @Field()
  @Column({ type: String, default: '', nullable: false })
  name: string;

  @Field()
  @Column({ type: String, default: '192.168.1.100', nullable: false })
  endpointIPaddress: string;

  @Field()
  @Column({ type: Number, default: 14550, nullable: false })
  telemetryPort: number;

  @Field()
  @Column({ type: Number, default: 5600, nullable: false })
  videoPort: number;

  @Field()
  @Column({ type: 'boolean', default: false, nullable: false })
  videoEnable: boolean;
}

export const getEndpointRepository = () => {
  return getRepository<Endpoint>(Endpoint);
};
