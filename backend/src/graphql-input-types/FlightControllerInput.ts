import { ArgsType, InputType, Field } from 'type-graphql';

@InputType()
export class FcProperties {
  @Field({ nullable: true })
    controller: string;

  @Field({ nullable: true })
    protocol: string;

  @Field({ nullable: true })
    connectionType: string;

  @Field({ nullable: true })
    internalAddress: string;

  @Field({ nullable: true })
    baudRate: string;

  @Field({ nullable: true })
    tcpPort: string;

  @Field({ nullable: true })
    binFlightLog: boolean;
}

@ArgsType()
@InputType()
export class FcInput {
  @Field({ nullable: true })
    fc: FcProperties;
}
