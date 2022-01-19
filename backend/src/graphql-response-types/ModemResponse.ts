import { Modem } from '../entity/Modem';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ModemResponse {
  @Field(() => Modem, { nullable: true })
    message: Modem;
}

// NIC Response

@ObjectType()
export class NicResponse {
  @Field(() => String, { nullable: true })
    interfaces: [string];
}
