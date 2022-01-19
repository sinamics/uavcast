// import { MyContext } from "src/graphql-types/MyContext";
import { getModemRepository } from '../entity/Modem';
import { Args, Query, Mutation, Resolver } from 'type-graphql';
import { ModemResponse, NicResponse } from '../graphql-response-types/ModemResponse';
import { ModemInput } from '../graphql-input-types/ModemInput';
import os from 'os';

@Resolver()
export class ModemResolver {
  @Mutation(() => ModemResponse)
  async storeModemValues(@Args() { properties }: ModemInput): Promise<any> {
    const modem = await getModemRepository().findOne(1);
    if (!modem) return await getModemRepository().save(properties);

    await getModemRepository().update(1, properties);
    return true;
  }

  @Query(() => ModemResponse)
  // @UseMiddleware(isAuth)
  async modemData(): Promise<any> {
    const message = await getModemRepository().findOne(1);
    return { message };
  }

  @Query(() => NicResponse)
  // @UseMiddleware(isAuth)
  async nic(): Promise<any> {
    // we only want to get the modem Interfaces, usually eth0,eth1, wwan0 ect
    // regex to remove unwanted nics
    const regEx = /^([zt]|[lo]|[wlan])/;

    //Get all nics
    const allNics = Object.keys(os.networkInterfaces());

    // Filter result based on the regex
    const filteredNics = allNics.filter((n) => !n.match(regEx));

    // Notify user that no devices was found!
    if (!filteredNics.length) return { interfaces: ['No Device Found!'] };

    // Return all devices as array
    return { interfaces: filteredNics.filter((n) => !n.match(regEx)) };
  }
}
