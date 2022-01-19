import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';
import { Endpoint } from '../entity/Endpoint';

@ObjectType()
export class EndpointResponse {
  @Field(() => Endpoint, { nullable: true })
    data?: Endpoint[];

  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}

@ObjectType()
export class UpdateEndpointResponse {
  @Field(() => Endpoint, { nullable: true })
    data?: Endpoint;

  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
