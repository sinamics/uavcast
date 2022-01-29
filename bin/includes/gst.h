#pragma once
#include <string>
#include <gst/gst.h>

// typedef struct VideosourceRecordType {
//     int deviceIndex;
//     int classIndex;
//     int inputIndex;
//     uint deviceURI;
//     unsigned int flags;
//     char deviceClassName[100];
//     char deviceSelectorProperty[100];
//     char deviceVideoPlugin[100];
//     char deviceHandle[1000];
//     char devicePath[1000];
//     char deviceName[1000];
//     char device[1000];
//     void* gstdevice; // GstDevice* for this device as enumerated by GstDeviceProvider/GstDeviceMonitor if using GStreamer 1.4.0+
// } VideosourceRecordType;


class Gst
{
public:
    std::string video_test_src(int arg, char *argv[]);
    int video_udp(int arg, char *argv[]);
    int video_udp_parse_launch();
    // static void caps(GstCaps *caps);
    int webcam_get_webcam_device_data();
    std::string invokeUsbCamera();
};
