import { Resolver, Query, Mutation, Args } from 'type-graphql';
import { Endpoint, getEndpointRepository } from '../entity/Endpoint';
import { EndpointResponse, UpdateEndpointResponse } from '../graphql-response-types/Endpoint';
import { RemoveEndpointInput, UpdateEndpointInput } from '../graphql-input-types/Endpoint';
import { ApolloError } from 'apollo-server-express';
import { childProcessCmd } from '../utils/childProcessCmd';
import winston from 'winston';

const DockerLog = winston.loggers.get('docker');

@Resolver()
export class EndpointResolver {
  @Mutation(() => EndpointResponse)
  async addEndpoint(): Promise<any> {
    const newEndp = new Endpoint();
    await getEndpointRepository().save(newEndp);

    const data = await getEndpointRepository().find();
    return { data };
  }

  @Mutation(() => EndpointResponse)
  async removeEndpoint(@Args() { id }: RemoveEndpointInput): Promise<any> {
    await getEndpointRepository().delete(id);
    const data = await getEndpointRepository().find();
    return { data };
  }

  @Mutation(() => UpdateEndpointResponse)
  async updateEndpoint(@Args() { endpoint }: UpdateEndpointInput): Promise<any> {
    const data = await getEndpointRepository().findOne(endpoint.id);
    if (!data) return new ApolloError('Endpoint does not exist!');
    Object.assign(data, endpoint);
    getEndpointRepository().save(data);

    if ('videoEnable' in endpoint) {
      if (endpoint.videoEnable) {
        childProcessCmd('/app/uavcast/bin/build/uav_main -v start').catch((err) =>
          DockerLog.error({ message: err, data: '/app/uavcast/bin/build/uav_main -v start', path: __filename })
        );
      }
      if (!endpoint.videoEnable) {
        childProcessCmd('/app/uavcast/bin/build/uav_main -v stop').catch((err) =>
          DockerLog.error({ message: err, data: '/app/uavcast/bin/build/uav_main -v stop', path: __filename })
        );
      }
    }

    return { data };
  }

  @Query(() => EndpointResponse)
  // @UseMiddleware(isAuth)
  async getEndpoints(): Promise<any> {
    const data = await getEndpointRepository().find();
    return { data };
  }
}
