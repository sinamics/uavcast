#!/usr/bin/python
# -*- coding: utf-8 -*-

# sudo apt-get install python-gst-1.0 gir1.2-gst-rtsp-server-1.0
import gi
gi.require_version('Gst','1.0')
gi.require_version('GstRtspServer','1.0')
from gi.repository import GLib, Gst, GObject, GstRtspServer
from netifaces import interfaces, ifaddresses, AF_INET

# GObject.threads_init()
Gst.init(None)

nic = []
for ifaceName in interfaces():
    addresses = [i['addr'] for i in ifaddresses(ifaceName).setdefault(AF_INET, [{'addr':'No IP addr'}] )]
    print('%s: %s' % (ifaceName, ', '.join(addresses)))
    nic.append(addresses)

print(nic[0][0])
class RTSP_Server:
    def __init__(self):
      self.server = GstRtspServer.RTSPServer()
      self.port = "554"
      self.server.set_address(nic[0][0])
      self.server.set_service(self.port)
      # Setup callback
      self.server.connect("client-connected",self.client_connected)

      self.factory = GstRtspServer.RTSPMediaFactory().new()
      self.factory.set_launch(( \
        'v4l2src device=/dev/video0 ! video/x-h264,width=640,height=480,framerate=30/1 ! ' \
        'h264parse ! ' \
        'queue ! ' \
        'rtph264pay  name=pay0 pt=96 ' \
      ))
      # allow multiple connections
      self.factory.set_shared(True)
      self.factory.set_transport_mode(GstRtspServer.RTSPTransportMode.PLAY)
      self.mounts = self.server.get_mount_points()
      self.mounts.add_factory('/live', self.factory)

      self.server.attach(None)
      # Output hint
      port = self.server.get_bound_port()
      print("Streaming on rtsp://{0}:{1}/h264".format(nic[0][0], port))
      GLib.MainLoop().run()
      print("Done.")

    def client_connected(self, arg1, arg2):
        print('Client connected')

server = RTSP_Server()