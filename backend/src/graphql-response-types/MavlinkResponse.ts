import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class HeartBeat {
  @Field(() => Boolean, { nullable: true })
    armed: boolean;

  @Field(() => Boolean, { nullable: true })
    connected: boolean;

  @Field(() => String, { nullable: true })
    firmware: string;

  @Field(() => String, { nullable: true })
    frame: string;

  @Field(() => Number, { nullable: true })
    type: number;

  @Field(() => Number, { nullable: true })
    autopilot: number;

  @Field(() => Number, { nullable: true })
    base_mode: number;

  @Field(() => Number, { nullable: true })
    custom_mode: number;

  @Field(() => Number, { nullable: true })
    system_status: number;

  @Field(() => Number, { nullable: true })
    mavlink_version: number;

  @Field(() => [NumOfGcs], { nullable: true })
    numOfGcs: NumOfGcs[];
}

@ObjectType()
export class VfrHud {
  @Field(() => Number, { nullable: true })
    airspeed: number;

  @Field(() => Number, { nullable: true })
    groundspeed: number;

  @Field(() => Number, { nullable: true })
    heading: number;

  @Field(() => Number, { nullable: true })
    throttle: number;

  @Field(() => Number, { nullable: true })
    alt: number;

  @Field(() => Number, { nullable: true })
    climb: number;
}

@ObjectType()
export class PowerStatus {
  @Field(() => Number, { nullable: true })
    Vcc: number;

  @Field(() => Number, { nullable: true })
    Vservo: number;

  @Field(() => Number, { nullable: true })
    flags: number;
}

@ObjectType()
export class NumOfGcs {
  @Field(() => Boolean, { nullable: true })
    type: string;
}

@ObjectType()
export class FailsafeGcs {
  @Field({ nullable: true })
    param_value: number;
}

@ObjectType()
export class Failsafe {
  @Field({ nullable: true })
    gcs: FailsafeGcs;

  @Field({ nullable: true })
    short: FailsafeGcs;

  @Field({ nullable: true })
    long: FailsafeGcs;
}

@ObjectType()
export class GpsRawInt {
  @Field({ nullable: true })
    fix_type: number;

  @Field({ nullable: true })
    lat: number;

  @Field({ nullable: true })
    lon: number;

  @Field({ nullable: true })
    alt: number;

  @Field({ nullable: true })
    vel: number;

  @Field({ nullable: true })
    cog: number;

  @Field({ nullable: true })
    satellites_visible: number;
}
@ObjectType()
class MavMessage {
  @Field({ nullable: true })
    heartbeat: HeartBeat;

  @Field({ nullable: true })
    vfr_hud: VfrHud;

  @Field({ nullable: true })
    power_status: PowerStatus;

  @Field({ nullable: true })
    failsafe: Failsafe;

  @Field({ nullable: true })
    gps_raw_int: GpsRawInt;
}

@ObjectType()
export class MavlinkResponse {
  @Field(() => MavMessage, { nullable: true })
    message: MavMessage;
}

@ObjectType()
export class MavAckResponse {
  @Field({ nullable: true })
    command: number;

  @Field({ nullable: true })
    result: number;

  @Field({ nullable: true })
    message: string;

  @Field(() => FieldError, { nullable: true })
    errors: [FieldError];
}
