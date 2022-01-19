import { getVpnRepository } from '../entity/Vpn';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { VpnResponse, ZerotierNetworkResponse } from '../graphql-response-types/VpnResponse';
import { VpnInput } from '../graphql-input-types/VpnInput';
import { kernelCommands } from '../utils/kernelCommands';
import { GraphQLUpload } from 'graphql-upload';
import { Upload } from '../graphql-types/Upload';
import { createWriteStream } from 'fs';
import path from 'path';

@Resolver()
export class VpnResolver {
  @Mutation(() => VpnResponse)
  async storeVpnValues(@Args() { properties }: VpnInput): Promise<any> {
    const vpn = await getVpnRepository().findOne(1);
    if (!vpn) return { data: await getVpnRepository().save(properties) };

    await getVpnRepository().update(1, properties);
    const data = await getVpnRepository().findOne(1);
    return { data };
  }

  @Mutation(() => Boolean)
  async uploadConfigFile(@Arg('file', () => GraphQLUpload) { createReadStream }: Upload): Promise<boolean> {
    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(path.join('/../../../../', `home/uavcast/etc/openvpn.conf`)))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false))
    );
  }

  @Query(() => ZerotierNetworkResponse)
  async zerotierNetworks(): Promise<any> {
    try {
      const res = await kernelCommands('sudo zerotier-cli -j listnetworks');
      const networks = JSON.parse(res.toString('utf8'));
      // console.log(res.toString('utf8'));
      return { networks };
    } catch (errors) {
      return { errors };
    }
  }

  @Query(() => VpnResponse)
  async vpnData(): Promise<any> {
    const data = await getVpnRepository().findOne({
      where: {
        id: 1
      }
    });

    return { data };
  }
}
