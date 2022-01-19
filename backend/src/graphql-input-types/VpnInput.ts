import { ArgsType, InputType, Field } from 'type-graphql';

@InputType()
export class VpnProperties {
  @Field({ nullable: true })
  enableVpn: boolean;

  @Field({ nullable: true })
  serviceProvider: string;

  @Field({ nullable: true })
  networkId: string;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  password: string;
}

@ArgsType()
@InputType()
export class VpnInput {
  @Field({ nullable: true })
  properties: VpnProperties;
}
