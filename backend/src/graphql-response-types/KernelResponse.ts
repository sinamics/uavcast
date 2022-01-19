import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class KernelResponse {
  @Field(() => String, { nullable: true })
    message: JSON;

  @Field(() => [FieldError], { nullable: true })
    errors: FieldError[];
}
