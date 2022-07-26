import { getVpnRepository } from '../entity/Vpn';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { VpnResponse, ZerotierNetworkResponse } from '../graphql-response-types/VpnResponse';
import { VpnInput } from '../graphql-input-types/VpnInput';
import { childProcessCmd } from '../utils/childProcessCmd';
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
      const listnetworks = await childProcessCmd({ cmd: 'sudo zerotier-cli -j listnetworks', logg: false });
      const networks = JSON.parse(listnetworks.toString('utf8'));

      // const peers = await childProcessCmd({ cmd: 'sudo zerotier-cli -j peers' });
      // const peersList = JSON.parse(peers.toString('utf8')).filter((peer: any) => peer.role === 'LEAF');
      // console.log(peersList);
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
