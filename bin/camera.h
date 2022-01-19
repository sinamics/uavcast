#pragma once
#include <string>

class Camera
{

public:
    std::string video_test_src(int arg, char *argv[]);
    int video_udp(int arg, char *argv[]);
    int video_udp_parse_launch();
    int webcam_get_webcam_device_data();
    std::string invokeUsbCamera();
};
