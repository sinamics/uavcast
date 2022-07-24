import { Entity, Check, PrimaryColumn, Column, getRepository } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class Logger {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field(() => ID)
  @Column({ type: Number, default: 1 })
  id: number;

  @Field()
  @Column({ type: Boolean, default: false, nullable: false })
  debug: boolean;

  @Field()
  @Column({ type: Number, default: 1.0, nullable: false })
  resolution: number;

  @Field()
  @Column({ type: Date, default: false, nullable: false })
  datetime: Date = new Date();

  @Field()
  @Column({ type: Boolean, default: true, nullable: false })
  logtemperature: boolean;

  @Field()
  @Column({ type: Boolean, default: true, nullable: false })
  cellSignal: boolean;

  @Field()
  @Column({ type: Boolean, default: true, nullable: false })
  satellites: boolean;

  @Field()
  @Column({ type: Boolean, default: true, nullable: false })
  altitude: boolean;
}
export const getLoggerRepository = () => {
  return getRepository<Logger>(Logger);
};
