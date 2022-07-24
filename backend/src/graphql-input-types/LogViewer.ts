import { ArgsType, Field, InputType } from 'type-graphql';

@ArgsType()
export class LogFileInput {
  // @Field({ nullable: true })
  @Field()
  filename: string;
}

// Log Parameters
@InputType()
export class LogParameters {
  @Field({ nullable: true })
  debug: boolean;

  @Field({ nullable: true })
  cellSignal: boolean;

  @Field({ nullable: true })
  satellites: boolean;

  @Field({ nullable: true })
  altitude: boolean;

  @Field({ nullable: true })
  resolution: number;
}

@InputType()
@ArgsType()
export class LogParametersInput {
  @Field()
  parameters: LogParameters;
}

@InputType()
export class LogProperties {
  @Field()
  minutes: number;

  @Field({ nullable: true })
  limit: number;
}

@InputType()
@ArgsType()
export class LogPeriodeInput {
  @Field()
  properties: LogProperties;
}

@InputType()
export class DownloadLogProperties {
  @Field({ nullable: true })
  from: number;

  @Field({ nullable: true })
  until: number;

  @Field()
  periode: string;
}
@InputType()
@ArgsType()
export class DownloadLogsInput {
  @Field()
  properties: DownloadLogProperties;
}

@InputType()
@ArgsType()
export class PruneLogsInput {
  @Field()
  service: string;
}
