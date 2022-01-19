// import { MyContext } from "src/graphql-types/MyContext";
import { FlightController, getFlightControllerRepository } from '../entity/FlightController';
import { Args, Query, Mutation, Resolver } from 'type-graphql';
import { FlightControllerResponse } from '../graphql-response-types/FlightController';
import { FcInput } from '../graphql-input-types/FlightControllerInput';
import { ApolloError } from 'apollo-server-express';
import '../mavlink';
import { CreateFlightController } from '../seeds/flightController.seed';
import { runSeeder } from 'typeorm-seeding';

@Resolver()
export class FlightControllerResolver {
  @Query(() => FlightControllerResponse)
  // @UseMiddleware(isAuth)
  async flightController(): Promise<any> {
    try {
      const data = await getFlightControllerRepository().findOne(1);
      if (!data) {
        await getFlightControllerRepository().save(new FlightController());
        const data = await getFlightControllerRepository().findOne(1);
        return { data };
      }
      return { data };
    } catch (errors) {
      return { errors };
    }
  }
  @Mutation(() => FlightControllerResponse)
  async updateFlightController(@Args() { fc }: FcInput): Promise<any> {
    const data = await getFlightControllerRepository().findOne(1);

    if (!data) {
      await runSeeder(CreateFlightController);
      const data = await getFlightControllerRepository().findOne(1);
      return { data };
    }

    if (!data) return new ApolloError('Could not fetch data from DB');
    Object.assign(data, fc);
    getFlightControllerRepository().save(data);
    return { data };
  }

  @Mutation(() => FlightControllerResponse)
  async resetFlightControllerDatabase(): Promise<any> {
    await getFlightControllerRepository().delete(1);
    await runSeeder(CreateFlightController);

    const data = await getFlightControllerRepository().findOne(1);
    return { data };
  }
}
