import { InputType, Field, ArgsType } from 'type-graphql';

@InputType()
export class ApplicationProperties {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  remoteVersionFetched?: boolean;

  @Field({ nullable: true })
  hasBeenUpdated?: boolean;

  @Field({ nullable: true })
  webPort?: number;
}

@InputType()
@ArgsType()
export class ApplicationInput {
  @Field()
  properties: ApplicationProperties;
}
