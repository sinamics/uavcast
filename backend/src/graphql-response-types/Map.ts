import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class MapResponse {
  @Field(() => Boolean, { nullable: false })
    mavCockpitDisable?: boolean;
}
