import { Arg, Mutation, Resolver } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Upload } from '../graphql-types/Upload';
import fs from 'fs';
import { childProcessCmdCallback } from '../utils/childProcessCmd';
import winston from 'winston';
import root from 'app-root-path';
import path from 'path';

const ServerLog = winston.loggers.get('server');

const sqlFolder = path.join(root.path, '../', '/data/sql');

@Resolver()
export class BackupRestoreResolver {
  @Mutation(() => Boolean)
  async uploadDatabaseFile(@Arg('file', () => GraphQLUpload) { createReadStream, filename }: Upload): Promise<boolean> {
    if (!filename) {
      ServerLog.error({ message: `No filename provided!`, data: filename, path: __filename });
      throw Error(`No filename provided!`);
    }

    const ext = filename.split('.').pop();
    if (ext !== 'gz') {
      ServerLog.error({ message: `Wrong file extenstion!`, data: ext, path: __filename });
      throw Error(`Wrong file extenstion!`);
    }

    const restoreFileName = path.join(sqlFolder, 'restore-uavcast-database.tar.gz');
    const bckDbName = path.join(sqlFolder, 'backup_uavcast.db');

    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(fs.createWriteStream(path.join('/../../../../', restoreFileName)))
        .on('finish', async () => {
          await childProcessCmdCallback(
            { cmd: `tar -xvf ${restoreFileName}`, stdout: false, options: { cwd: sqlFolder } },
            async () => {
              await childProcessCmdCallback(
                { cmd: `sqlite3 ${sqlFolder}/uavcast.db ".restore 'backup_uavcast.db'"`, options: { cwd: sqlFolder } },
                () => {
                  fs.unlinkSync(restoreFileName);
                  fs.unlinkSync(bckDbName);
                  ServerLog.info({ message: `Successfully performed backup of SQL database.`, data: filename, path: __filename });
                }
              );
            }
          );

          resolve(true);
        })
        .on('error', (err: any) => {
          ServerLog.error({ message: `createReadStream error!`, data: err, path: __filename });
          reject(false);
        })
    );
  }
}
