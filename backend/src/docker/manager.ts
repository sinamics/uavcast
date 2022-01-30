'use strict';
//inspired by https://github.com/pterodactyl/daemon/blob/ab4b5254c9daa8a2e4f8ff04ed6797d17ca6d80d/src/controllers/docker.js

import Dockerode from 'dockerode';
import Async from 'async';
import winston from 'winston';
import stream from 'stream';

const ServerLog = winston.loggers.get('docker');
const DockerController = new Dockerode({ socketPath: '/var/run/docker.sock' });

const logStream = new stream.PassThrough();

class DockerUtils {
  stream: any;
  procData: any;
  logStream: null;
  container: any;
  server: any;
  config: any;
  pubsub: any;

  constructor(config: any) {
    this.container;
    this.config = config;
    this.stream = undefined;
    this.procData = undefined;
    this.logStream = null;
    this.pubsub = null;

    this.init();
  }
  /**
   * Attach image if already running and initilize this.container.
   * @return this.container
   */
  async init() {
    const opts = {
      all: true,
      filters: {
        name: [this.config.name]
      }
    };
    const cont = new Promise((resolve, reject) => {
      this.container = DockerController.listContainers(opts, function (err, containers: any) {
        if (err || containers.length === 0) {
          return reject(null);
        }
        containers.map(function (containerInfo: any) {
          resolve(DockerController.getContainer(containerInfo.Id));
        });
      });
    });

    this.container = await Promise.resolve(cont).catch(() => null);
  }
  async notify(publish: any) {
    this.pubsub = publish;
  }
  /**
   * Determines if an image exists.
   * @return boolean
   */
  exists(image: any, callback: any) {
    const Image = DockerController.getImage(image);
    Image.inspect(callback);
  }

  /**
   * Stops a given container and returns a callback when finished.
   * @param  {Function} next
   * @return {Function}
   */
  stop() {
    this.container.remove({ force: true });
    this.container = null;
    this.pubsub({ message: '[INFO] stopped!' });
  }

  /**
   * Kills a given container and returns a callback when finished.
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  kill(next: any) {
    if (this.stream) {
      this.stream.end();
    }
    this.container.kill(next);
  }

  /**
   * Attaches to a container's stdin and stdout/stderr.
   *
   * @return {Promise<any>}
   */
  attach() {
    return new Promise((resolve, reject) => {
      // Check if we are currently running exec(). If we don't do this then we encounter issues
      // where the daemon thinks the container is crashed even if it is not. Mostly an issue
      // with exec(), but still worth checking out here.
      if (this.stream) {
        return reject(new Error('An active stream is already in use for this container.'));
      }

      let logdata = '';
      const pub = this.pubsub;
      logStream.on('data', async function (chunk) {
        ServerLog.info({ message: chunk.toString('utf8'), path: __filename });
        logdata = logdata + chunk.toString('utf8');
        pub({ message: logdata });
      });

      logStream.on('error', async function (chunk) {
        ServerLog.error({ message: chunk.toString(), path: __filename });
        logdata = logdata + chunk.toString();
        pub({ message: logdata });
      });
      this.container
        .attach({
          stream: true,
          stdin: true,
          stdout: true,
          stderr: true
        })
        .then((stream: any) => {
          if (!stream) return;

          this.stream = stream;
          this.container.modem.demuxStream(this.stream, logStream, logStream);
          // this.stream.setEncoding('utf8');

          // In this case we're still using the logs to actually output contents, but we will use the
          // attached stream to monitor for excessive data sending.
          this.stream
            .on('end', () => {
              this.stream = undefined;
              // this.server.streamClosed();
            })
            .on('error', (streamError: any) => {
              ServerLog.error({ message: streamError, path: __filename });
            });

          resolve(true);
        })
        .catch(reject);
    });
  }
  /**
   * Starts a given container and returns a callback when finished.
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  start(cmd: any) {
    Async.auto({
      build_image: (callback: () => any) => {
        ServerLog.info({ message: '>>> building image..', path: __filename });
        this.pubsub({ message: '[INFO] building image..' });
        this.build(callback, cmd);
      },
      start_image: [
        'build_image',
        (r: any, callback: () => any) => {
          ServerLog.info({ message: '>>> starting image', path: __filename });
          this.pubsub({ message: '[INFO] starting image..' });

          this.container
            .start()
            .then(() => {
              // this.server.setStatus(St
              ServerLog.info({ message: '>>> attaching to image', path: __filename });
              this.pubsub({ message: '[INFO] attaching to image..' });

              Promise.all([this.attach()]).catch(callback);
            })
            .catch((err: { message: string }) => {
              if (err && err.message.includes('container already started')) {
                //this.server.setStatus(Status.ON);
                this.pubsub({ message: '[INFO] container has already started' });
                ServerLog.info({ message: err, path: __filename });
              }

              // callback(err);
            });
        }
      ]
    }).catch((err) => {
      ServerLog.info({ message: err, path: __filename });
    });
  }
  /**
   * Builds a new container for a server.
   * @param  {Function} next
   * @return {Callback}
   */
  build(next: any, cmd: any) {
    Async.auto(
      {
        // create_data_folder: (callback: any) => {
        //   Fs.ensureDir(this.server.path(), callback);
        // },
        update_images: (callback: () => any) => {
          // The default is to not automatically update images.
          this.exists(this.config.image, (err: any) => {
            if (!err) return callback();

            ServerLog.info({ message: "Pulling image %s because it doesn't exist on the system.", path: __filename });

            this.pull(this.config.image, (pullErr: any) => {
              if (pullErr) {
                ServerLog.error({
                  message: 'Encountered an error while attempting to fetch a fresh image. Continuing with existing system image.',
                  data: pullErr,
                  path: __filename
                });
              }

              return callback();
            });
          });
        },
        create_container: [
          'update_images',

          (r: any, callback: any) => {
            ServerLog.info({ message: '>>> Creating new container...', path: __filename });
            if (!this.config.image || !this.config.name) {
              return callback(new Error('No docker image or name was passed to the script. Unable to create container!'));
            }

            // Make the container
            const Container = {
              Image: this.config.image,
              name: this.config.name,
              AttachStdin: true,
              AttachStdout: true,
              AttachStderr: true,
              OpenStdin: true,
              Tty: false,
              Cmd: cmd,
              //   Env: environment,
              //   ExposedPorts: exposed,
              HostConfig: {
                Privileged: true,
                AutoRemove: true,
                NetworkMode: 'host'
              }
            };

            DockerController.createContainer(Container, (err: any, container: any) => {
              this.container = container;
              callback(err, container);
            });
          }
        ]
      },
      (err: any) => {
        if (err) {
          ServerLog.info({ message: '>>> Image exsist', data: err, path: __filename });
          ServerLog.debug({ message: err, data: err, path: __filename });
          this.pubsub({ message: '[ERROR] image already running!, stop first.' });
          return next('>>> Image exsist');
        }
        return next(null, {
          image: this.config.image
        });
      }
    );
  }

  /**
   * Destroys a container for a server.
   */
  //   destroy(container: any, next: (arg0: undefined) => any) {
  //     const FindContainer = DockerController.getContainer(container);
  //     FindContainer.inspect((err: { reason: string | undefined }) => {
  //       if (!_.isNull(this.logStream)) {
  //         this.logStream.unwatch();
  //         this.logStream = null;
  //       }

  //       if (!err) {
  //         this.container.remove(next);
  //       } else if (err && _.startsWith(err.reason, 'no such container')) {
  //         // no such container
  //         this.server.log.debug(
  //           { container_id: container },
  //           'Attempting to remove a container that does not exist, continuing without error.'
  //         );
  //         return next();
  //       } else {
  //         return next(err);
  //       }
  //     });
  //   }
  /**
   * Pulls an image to the server.
   * @param  string       image
   * @param  {Function}   next
   * @return {Function}
   */
  pull(image: any, next: any) {
    // let pullWithConfig: any = {};

    DockerController.pull(image, {}, (err, stream) => {
      if (err) return next(err);

      let SendOutput: any;
      let receivedError = false;
      stream.setEncoding('utf8');

      stream.on('data', (data: any) => {
        if (receivedError) {
          return;
        }

        const j = JSON.parse(data);
        if ('error' in j) {
          receivedError = true;

          if (SendOutput) {
            clearInterval(SendOutput);
          }

          return next(new Error(j.error));
        }

        if (!SendOutput) {
          ServerLog.info({ message: `Pulling image ${image} ... this could take a few minutes.`, path: __filename });
          const TimeInterval = 2;
          SendOutput = setInterval(() => {
            ServerLog.info({ message: `Pulling image ${image} ... this could take a few minutes.`, path: __filename });
          }, TimeInterval * 1000);
        }
      });

      stream.on('end', () => {
        if (SendOutput) {
          clearInterval(SendOutput);
        }

        if (!receivedError) {
          return next();
        }
      });

      stream.on('error', next);
    });
  }
}

export default DockerUtils;
