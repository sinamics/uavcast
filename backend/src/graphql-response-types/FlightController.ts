import { FlightController } from '../entity/FlightController';
import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class FlightControllerResponse {
  @Field(() => FlightController, { nullable: true })
    data: FlightController;

  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
