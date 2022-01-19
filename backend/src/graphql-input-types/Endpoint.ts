import { InputType, Field, ArgsType } from 'type-graphql';

@InputType()
export class EndpointProperties {
  @Field({ nullable: true })
    id: string;

  @Field({ nullable: true })
    telemEnable?: boolean;

  @Field({ nullable: true })
    moduleActive?: boolean;

  @Field({ nullable: true })
    name?: string;

  @Field({ nullable: true })
    endpointIPaddress?: string;

  @Field({ nullable: true })
    telemetryPort?: number;

  @Field({ nullable: true })
    videoPort?: number;

  @Field({ nullable: true })
    videoEnable?: boolean;
}

@InputType()
@ArgsType()
export class EndpointInput {
  @Field({ nullable: true })
    endpoint: EndpointProperties;
}

@InputType()
@ArgsType()
export class RemoveEndpointInput {
  @Field({ nullable: true })
    id: string;
}

@InputType()
@ArgsType()
export class UpdateEndpointInput {
  @Field({ nullable: true })
    endpoint: EndpointProperties;
}
