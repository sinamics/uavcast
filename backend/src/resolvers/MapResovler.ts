import { MapResponse } from '../graphql-response-types/Map';
import { Query, Resolver } from 'type-graphql';
import { Map } from '../entity/Map';

@Resolver()
export class MapResovler {
  @Query(() => MapResponse)
  async map(): Promise<any> {
    return await Map.findOne(1);
  }
}
