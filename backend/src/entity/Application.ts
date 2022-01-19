import { Entity, Check, PrimaryColumn, Column, BaseEntity, getRepository } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class Application extends BaseEntity {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field(() => ID)
  @Column({ type: Number, default: 1 })
  id: number;

  @Field()
  @Column({ type: Date, default: false })
  remoteVersionFetched: Date = new Date();

  @Field()
  @Column({ type: Boolean, default: false })
  hasBeenUpdated: boolean;

  @Field()
  @Column({ type: Number, default: false })
  webPort: number;
}
export const getApplicationRepository = () => {
  return getRepository<Application>(Application);
};
