import { ArgsType, InputType, Field } from 'type-graphql';

@InputType()
export class ModemProperties {
  @Field({ nullable: true })
    enableModem: boolean;

  @Field({ nullable: true })
    modemType: string;

  @Field({ nullable: true })
    modemInformation: boolean;

  @Field({ nullable: true })
    modemInterface: string;

  @Field({ nullable: true })
    internalAddress: string;

  @Field({ nullable: true })
    pinCode: string;

  @Field({ nullable: true })
    username: string;

  @Field({ nullable: true })
    password: string;
}

@ArgsType()
@InputType()
export class ModemInput {
  @Field({ nullable: true })
    properties: ModemProperties;
}
