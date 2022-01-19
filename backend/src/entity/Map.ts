import { Entity, Check, PrimaryColumn, Column, BaseEntity } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
@Check(`ensure = 1`)
export class Map extends BaseEntity {
  @PrimaryColumn({ type: 'int', default: () => `1`, nullable: false })
  public ensure: 1;

  @Field()
  @Column({ type: Boolean, nullable: false })
    mavCockpitDisable: boolean;

  // @Field()
  @Column({ type: String, default: 'hey', nullable: true })
    text = 'hey';

  //   @BeforeInsert()
  //   beforeInsertActions() {
  //     this.mavCockpitDisable = false;
  //     this.text = 'fdfds';
  //   }
  //   @Field()
  //   @Column({type: Boolean, default: false , nullable: false})
  //   mavCockpitDisable: boolean;
}
