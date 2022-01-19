import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class KernelInput {
  // @Field({ nullable: true })
  @Field()
  cmd: string;

  @Field({ nullable: true })
  shell?: boolean;

  @Field()
  path?: string;
}
