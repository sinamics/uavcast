#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include "rtsp.h"
#include <stdio.h>
#include "db.h"
#include "utils.h"
#include <jsoncpp/json/json.h>

#define rtsp_stat_cont() "sudo docker ps --all --format '{{.Names}}' -f name=^/v4l2rtspserver$ | grep -w v4l2rtspserver | awk '{print $1}'"
using namespace std;

// docker run --platform linux/arm/v7 --device=/dev/video0 --rm  -it --net=host --name stream --privileged mpromonet/v4l2rtspserver
int Rtsp::rtsp_status ()
{
    Utils utils;
    Json::Value status;
    Json::FastWriter fastWriter;

    status["rtsp_ready"] = false;

    string v4ctl_container = utils.exec(rtsp_stat_cont());
    if(!v4ctl_container.empty()){
        status["rtsp_ready"] = true;
    }

    cout << fastWriter.write(status) << endl;
    return 0;
}
int Rtsp::rtsp_assembler ()
{
    Database db;
    camera_values camera;
    db.get_camera(&camera);
    Utils utils;

    if(camera.cameraType.empty()){
        cout << ">>> No cameratype provided!" << "\n";
        return 1;
    }

    cout << ">>> Creating rtsp streaming container!" << "\n";
    string assembler_str =
        string("sudo docker create --device=") + camera.cameraType +
        string(" --rm -it --net=host --name stream --privileged --tty mpromonet/v4l2rtspserver ") +
        string("-u uavcast -G ") + camera.resolution + string("x") + to_string(camera.framesPrSecond);

    cout << assembler_str << endl;

    string v4ctl_container = utils.exec_p(assembler_str.c_str());
    if(!v4ctl_container.empty()){
        cout << ">>> rtsp container created" << "\n";
    }

    string run =
        string("sudo docker start stream");

    cout << run << endl;

    string v4ctl_run = utils.exec_p(run.c_str());
    if(!v4ctl_run.empty()){
        cout << ">>> rtsp container created" << "\n";
    }

    return 0;
}
