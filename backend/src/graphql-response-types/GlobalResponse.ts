import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class StatusResponse {
  @Field(() => Boolean, { nullable: true })
    mavproxy: boolean;

  @Field(() => Boolean, { nullable: true })
    has_camera: boolean;

  @Field(() => Boolean, { nullable: true })
    video: boolean;

  @Field(() => Boolean, { nullable: true })
    modem: boolean;

  @Field(() => Boolean, { nullable: true })
    uavcast_systemd_active: boolean;

  @Field(() => Boolean, { nullable: true })
    uavcast_systemd_enabled: boolean;

  @Field(() => Boolean, { nullable: true })
    vpn: boolean;

  @Field(() => Boolean, { nullable: true })
    undervoltage: boolean;

  @Field(() => String, { nullable: true })
    arch: string;
}
