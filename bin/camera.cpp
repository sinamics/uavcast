#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include <gst/gst.h>
#include "includes/gst.h"
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include "includes/db.h"
#include "includes/utils.h"
#include "includes/rtsp.h"

int main(int argc, char *argv[])
{

    Utils utils;
    Rtsp rtsp;
    Database db;
    camera_values camera;
    db.get_camera(&camera);

    if (argc == 1)
    {
        std::cout << "camera application for uavcast. Type -h or --help to learn more\n";
    }

    for (int i = 0; i < argc; i++)
    {
        if (std::string(argv[i]) == "-h" || std::string(argv[i]) == "--help")
        {
            std::cout << "Option -start to start video\n";
            std::cout << "Option -stop to stop all services\n\n\n";
            std::cout << "author: Bernt Christian Egeland / uavmatrix.com\n\n";
        }

        if (std::string(argv[i]) == "-start" || std::string(argv[i]) == "--start")
        {

            if(camera.protocol == "rtsp") {
                rtsp.rtsp_assembler();
            }

        }
        if (std::string(argv[i]) == "-stop" || std::string(argv[i]) == "--stop")
        {

            // Check if video is running
            std::string camera_enabled = utils.exec("sudo systemctl is-active uavcast-camera");
            if (utils.isWordPresent(camera_enabled, "active"))
            {
                std::cout << "Could not stop camera proccess!!\n";
            }
            else
            {
                std::cout << "Camera has been stopped!\n";
            }

            return 0;
        }
    }
}