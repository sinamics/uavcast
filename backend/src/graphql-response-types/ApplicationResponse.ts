import { Application } from '../entity/Application';
import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class ApplicationResponse {
  @Field(() => Application, { nullable: true })
  properties?: Application;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
