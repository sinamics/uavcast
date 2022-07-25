import express from 'express';
import { childProcessCmd, childProcessCmdCallback } from '../utils/childProcessCmd';
import winston from 'winston';
import fs from 'fs';
import root from 'app-root-path';
import path from 'path';

const ServerLog = winston.loggers.get('server');
const sqlFolder = path.join(root.path, '../', '/data/sql');

const bkName = `backup_uavcast.db`;
const tarName = `backup_uavcast.tar.gz`;

export const backupDatabase = (app: any) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/api/backupSqlite', async function (_request: express.Request, response: express.Response) {
    const dbPath = path.join(sqlFolder, 'backup_uavcast.db');
    const tarPath = path.join(sqlFolder, 'backup_uavcast.tar.gz');

    await childProcessCmd(`sqlite3 ${sqlFolder}/uavcast.db ".backup '${dbPath}'"`).catch((err: any) => {
      ServerLog.error({
        message: 'An error occured when sending kernel commands',
        data: `error response: ${err}`,
        path: __filename
      });
    });

    childProcessCmdCallback(`tar -czvf ${tarName} ${bkName}`, sqlFolder, false, (res: number) => {
      if (res !== 0) {
        ServerLog.error({
          message: 'Could not generate tar file!, try again or report this error',
          data: `response code: ${res}`,
          path: __filename
        });
        return response.status(500).send({ error: 'Could not generate tar file!, try again or report this error' });
      }
      const file = fs.readFileSync(tarPath);
      const stat = fs.statSync(tarPath);

      ServerLog.info({
        message: 'sending backup file to client',
        data: `callbcak code: ${res}`,
        file: file,
        path: __filename
      });

      response.setHeader('Content-Length', stat.size);
      response.setHeader('Content-Type', 'application/x-tar');
      response.setHeader('Content-Disposition', 'attachment; filename=' + tarName);
      response.write(file);
      response.end('end', () => {
        fs.unlinkSync(tarPath);
        fs.unlinkSync(dbPath);
      });

      return true;
    });
  });
};
