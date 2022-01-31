#pragma once
#include <string>

class Camera
{

public:
    int rtsp_docker_start();
    int rtsp_docker_stop();
    int initialize();
    int teardown();
};