#pragma once
#include <string>

class Camera
{

public:
    int rtsp_docker_start();
    int gst_docker_start();
    int initialize();
    int teardown();
};