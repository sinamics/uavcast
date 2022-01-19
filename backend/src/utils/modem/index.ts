/* eslint @typescript-eslint/no-var-requires: "off" */
import { merge } from 'lodash';
import os from 'os';
import { getModemRepository } from '../../entity/Modem';
import AppLogger from '../../logger/ulog';

const intervalTime = 3000;
let runFunctionTimeout: any = '';

export const getModemInfo = () => {
  const callModemAPI = async (reRun: () => void) => {
    const ifaces = os.networkInterfaces();
    // if (modem.use_modem === 'false' || modem.MM_Model !== 'HiLink' ||
    // modem.MM_EnableModemInformation === 'false' || !ifaces[modem.MM_hilink_interface]) {
    //   return;
    // }
    const dbModem = await getModemRepository().findOne(1);
    if (!dbModem || !dbModem.enableModem || dbModem.modemType !== 'hilink' || !ifaces[dbModem?.modemInterface]) return;

    const host_ip: string = ifaces[dbModem?.modemInterface][0].address || '';
    const host_ip_arr = host_ip.split('.');
    host_ip_arr[3] = '1';

    fetchData(host_ip_arr.join('.'));

    reRun();
  };

  const runEach5sec = () => {
    if (runFunctionTimeout) clearTimeout(runFunctionTimeout);
    runFunctionTimeout = setTimeout(() => {
      callModemAPI(runEach5sec);
    }, intervalTime);
  };

  runEach5sec();
};

const fetchData = (gw: string) => {
  const modem = require('./lib/router').create({
    gateway: gw
  });
  modem.getToken(function (_: any, token: any) {
    modem.login(token, 'admin', 'admin', async () => {
      const modemStatus = () => {
        return new Promise((resolve) => {
          modem.getStatus(token, function (_: any, response: unknown) {
            resolve(response);
          });
        });
      };
      const getCurrentPLMN = () => {
        return new Promise((resolve) => {
          modem.getCurrentPLMN(token, function (_: any, response: unknown) {
            resolve(response);
          });
        });
      };

      Promise.all([modemStatus(), getCurrentPLMN()]).then((result: any) => {
        const data = merge({}, result[0], result[1]);

        if (Object.keys(data).length === 0) return AppLogger.mergeData({ cellSignal: 0 });
        AppLogger.mergeData({ cellSignal: parseInt(data.SignalStrength[0], 10) || 0 });
      });
      // .catch((err) => console.log(err));
    });
  });
};
