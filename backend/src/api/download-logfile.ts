import path from 'path';
import express from 'express';
import { paths } from '../config/paths';
import SystemLogger from '../logger';
import JSZip from 'jszip';
import Promise from 'bluebird';
import fs from 'fs';

export const fileDownload = (app: any) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/api/getLogFiles', async function (request: any, response: any) {
    const System: any = SystemLogger.getLogger();
    const date = new Date();
    const zip = new JSZip();

    const periode = request.body.periode;
    const selectedServices = request.body.selectedServices;

    let from: any = new Date().valueOf() - 60 * 60 * 1000;
    let until: any = new Date();

    switch (periode) {
      case 'last30min': {
        from = new Date().valueOf() - 60 * 30 * 1000;
        until = new Date();

        break;
      }
      case 'lastHour': {
        from = new Date().valueOf() - 60 * 60 * 1000;
        until = new Date();

        break;
      }
      case 'today': {
        from = date.setHours(0, 0, 0, 0);
        until = date.setHours(24, 0, 0, 0);

        break;
      }
      case 'yesterday': {
        from = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0);
        until = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(24, 0, 0, 0);

        break;
      }

      case 'last7days': {
        from = new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0);
        until = new Date().setHours(24, 0, 0, 0);

        break;
      }
      case 'thisMonth': {
        from = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        until = new Date().setHours(24, 0, 0, 0);

        break;
      }
      default:
        return response.status(400).send({
          message: 'No Periode found!'
        });
    }

    await Promise.map(selectedServices, async (service: string) => {
      if (service === 'statistics') {
        const { dailyRotateFile: cpuFile }: any = await System.cpuLogger.queryLogs({ from, until });
        zip.file(`cpu.log`, JSON.stringify(cpuFile, null, 4));

        const { dailyRotateFile: tempFile }: any = await System.temperatureLogger.queryLogs({ from, until });
        zip.file(`temperature.log`, JSON.stringify(tempFile, null, 4));

        const { dailyRotateFile: networkfile }: any = await System.networkLogger.queryLogs({ from, until });
        zip.file(`network.log`, JSON.stringify(networkfile, null, 4));
      }

      if (service === 'serverLogger') {
        // server winston logs
        const { dailyRotateFile: file }: any = await System[service].queryLogs({ from, until });
        zip.file(`system-core.log`, JSON.stringify(file, null, 4));

        // Get systemctl logs
        const systemctlPath = '/var/log/journal';
        if (fs.statSync(systemctlPath).isDirectory()) {
          const directoryContents = fs.readdirSync(systemctlPath, {
            withFileTypes: true
          });
          directoryContents.forEach(({ name }) => {
            const path = `${systemctlPath}/${name}`;
            if (fs.statSync(path).isFile()) {
              zip.file(name, fs.readFileSync(path, 'utf-8'));
            }
          });
        }
      }
    });

    const zipAsBase64 = await zip.generateAsync({ type: 'base64' });
    response.end(zipAsBase64);
  });

  app.post('/api/downloadLogFile', function (request: any, response: any) {
    const filename = request.body.fileName;
    const folder = request.body.folder;

    const logRoot = path.join(paths.logFolder, folder);
    // File options
    const options = {
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'content-disposition': 'attachment; filename=' + filename,
        'content-type': 'text/json'
      }
    };
    const pathToFile = path.join(logRoot, filename);
    response.download(pathToFile, filename, options);
  });
};
