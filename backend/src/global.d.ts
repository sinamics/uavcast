export {};
declare module 'winston' {
  interface Logger {
    server: any;
    modem: any;
    applicationState: any;
  }
}
