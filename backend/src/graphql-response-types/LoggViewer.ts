import { Logger } from '../entity/Logger';
import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class LoggResponse {
  @Field(() => Logger, { nullable: true })
  logs: Logger;

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];
}

@ObjectType()
export class LoggFilesResponse {
  @Field(() => String, { nullable: true })
  files: string[];

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];
}

@ObjectType()
export class LoggDataResponse {
  @Field(() => String, { nullable: true })
  data: string;

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];
}

// Temperature logs
@ObjectType()
export class TempLoggDataProperties {
  @Field(() => String)
  timestamp: string;

  @Field(() => String)
  message: string;
}
@ObjectType()
export class TempLoggDataResponse {
  @Field(() => [TempLoggDataProperties], { nullable: true })
  file: TempLoggDataProperties[];

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];
}

// Network logs
@ObjectType()
export class NetworkLoggDataPropertiesValues {
  @Field(() => String)
  iface: string;

  @Field(() => Number)
  rx_bytes: number;

  @Field(() => Number)
  tx_bytes: number;

  @Field(() => Number, { nullable: true })
  rx_sec: number;

  @Field(() => Number, { nullable: true })
  tx_sec: number;
}

@ObjectType()
export class NetworkLoggDataProperties {
  @Field(() => String)
  timestamp: string;

  @Field(() => [NetworkLoggDataPropertiesValues], { nullable: true })
  message: NetworkLoggDataPropertiesValues[];
}
@ObjectType()
export class NetworkLoggDataResponse {
  @Field(() => [NetworkLoggDataProperties], { nullable: true })
  file: TempLoggDataProperties[];

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];
}

@ObjectType()
export class WinstonProperties {
  @Field(() => String)
  timestamp: string;

  @Field(() => String, { nullable: true })
  message: string;
}
@ObjectType()
export class WinstonResponse {
  @Field(() => [WinstonProperties], { nullable: true })
  file: WinstonProperties[];

  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[];
}
