import { InputType, Field, ArgsType } from 'type-graphql';

@InputType()
@ArgsType()
export class SupervisorInput {
  @Field({ nullable: true })
    version: string;

  @Field({ nullable: true })
    type: string;

  @Field({ nullable: true })
    command: string;
}
@InputType()
@ArgsType()
export class getApplicationVersionInput {
  @Field()
    application: string;
}
