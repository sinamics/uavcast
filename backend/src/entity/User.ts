import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType({ isAbstract: true })
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
    id: number;

  @Field()
  @Column('text', { unique: true })
    email: string;

  @Field()
  @Column()
    password: string;
}

@ObjectType({ isAbstract: true })
@Entity()
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: string;

  @Field()
    status: string;
}
