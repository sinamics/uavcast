import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field({ nullable: true })
    path?: string;

  @Field({ nullable: true })
    message?: string;
}
