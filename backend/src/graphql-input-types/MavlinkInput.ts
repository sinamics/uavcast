import { ArgsType, InputType, Field } from 'type-graphql';

@ArgsType()
@InputType()
export class MavlinkCommandInput {
  @Field({ nullable: true })
    type: string;

  @Field({ nullable: true })
    value: string;
}
