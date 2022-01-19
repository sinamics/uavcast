import { StatusResponse } from '../graphql-response-types/GlobalResponse';
import { Resolver, Subscription, Root, Mutation, Args, Query } from 'type-graphql';
import { getStatus } from '../utils/readStatusFile';
import { ApplicationResponse } from '../graphql-response-types/ApplicationResponse';
import { ApplicationInput } from '../graphql-input-types/ApplicationInput';
import { getApplicationRepository } from '../entity/Application';
import { runSeeder } from 'typeorm-seeding';
import { CreateApplication } from '../seeds/application.seed';
import winston from 'winston';

const ServerLog = winston.loggers.get('server');
@Resolver()
export class ApplicationResolver {
  @Query(() => ApplicationResponse)
  // @UseMiddleware(isAuth)
  async getApplication(): Promise<any> {
    const properties = await getApplicationRepository().findOne(1);
    return { properties };
  }
  @Mutation(() => ApplicationResponse)
  async updateApplication(@Args() { properties }: ApplicationInput): Promise<any> {
    const app = await getApplicationRepository().findOne(1);

    if ('webPort' in properties) {
      const { webPort }: any = properties;

      if (
        !/^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(
          webPort?.toString()
        )
      ) {
        ServerLog.error({ message: `Cannot change webport to ${webPort}`, data: webPort, path: __filename });
        return new Error('invalid port number');
      }
    }
    if (!app) {
      runSeeder(CreateApplication);
      ServerLog.info({ message: `Seeds Application database`, path: __filename });
    }

    await getApplicationRepository().update(1, properties);
    const data = await getApplicationRepository().findOne(1);
    return { properties: data };
  }
  //Application status
  @Subscription(() => StatusResponse, {
    subscribe: (_root, _args, context) => {
      getStatus(context.pubsub);
      return context.pubsub.asyncIterator('APPLICATION_STATUS');
    }
  })
  async status(@Root() status: StatusResponse): Promise<any> {
    return status;
  }
}
