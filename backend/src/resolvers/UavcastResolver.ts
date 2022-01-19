import { Mutation, Resolver } from 'type-graphql';

@Resolver()
export class UAVcastResovler {
  @Mutation(() => String)
  async startStopUavcast(): Promise<string> {
    // await Global.update(1, {
    //   useModem: true,
    //   useVpn: true,
    // });

    //   await Vpn.create({
    //   zt_id: '6e15a3858c388c18' ,
    // }).save()

    // let globals = await Global.findOne(1);
    // if(!global) return await Global.create({useModem:false, useVpn:false}).save();

    // global.useModem = true;
    // await global?.save();
    // console.log(globals);
    return 'record created';
  }
}
