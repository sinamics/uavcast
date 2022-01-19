import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './FieldError';
import { Vpn } from '../entity/Vpn';

@ObjectType()
export class VpnResponse {
  @Field(() => Vpn, { nullable: true })
    data: Vpn;

  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}

@ObjectType()
export class ZerotierNetworkProperties {
  @Field(() => [String])
    assignedAddresses: string[];

  @Field(() => String)
    name: string;

  @Field(() => String)
    nwid: string;

  @Field(() => String)
    portDeviceName: string;

  @Field(() => String)
    status: string;

  @Field(() => String)
    type: string;
}

@ObjectType()
export class ZerotierNetworkResponse {
  @Field(() => [ZerotierNetworkProperties], { nullable: true })
    networks: ZerotierNetworkProperties[];

  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
}
