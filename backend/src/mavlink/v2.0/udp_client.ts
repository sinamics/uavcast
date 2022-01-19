import udp from 'dgram';

class UdpClient {
  port: any;
  localhost: string;
  udpStream: udp.Socket;
  constructor() {
    // the serial device object
    this.port = 12550;
    this.localhost = '127.0.0.1';
    this.udpStream = udp.createSocket({ type: 'udp4', reuseAddr: true });
    this.udpStream.bind(this.port);
  }

  closeLink() {
    this.udpStream.close();
  }
}

export default UdpClient;
