#include <iostream>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include "includes/db.h"
#include "includes/modem.h"
#include "includes/mavlink.h"
#include "includes/utils.h"
#include "includes/app.h"
#include "includes/logger.h"
#include <chrono>
#include <thread>

Utils utils;
Mavlink mavlink;
Modem modem;
App app;

int auto_start()
{
    Logger log;
    // Database db;

    // check if devices is online
    std::string pingCmd = "timeout 0.2 ping 8.8.8.8 -q -c1 -w 1 > /dev/null 2>&1";
    const char *pingC = pingCmd.c_str();
    if (system(pingC) != 0)
    {
        log.Info("Seems like this devices is not connected to the internet, we will continue anyway");
    }

    // // #Check if VPN should be enabled
    // if (global.useVpn)
    // {
    //     Vpn vpn;
    //     LOG("We should start vpn")
    //     // string res = vpn.init();
    //     // LOG(res << '")
    // }

    /* 
        
        Start mavlink

    */
    mavlink.connect();


    /* 
        
        Start Modem

    */
    modem.connect();

    /* 
        
        Start Camera

    */
    utils.exec("sudo systemctl restart uavcast-camera");

    // Camera camera;
    // std::thread t1(&Camera::video_udp_parse_launch, camera);

    // LOG("Called after camera is launched!" << '")

    // t1.join();
    exit(0);
}

int stop_all()
{

    mavlink.disconnect();
    utils.exec("sudo systemctl stop uavcast-camera");
    //Camera is runing this thread. Will be stopped when closing this thread.
    return 0;
}

int main(int argc, char *argv[])
{
    Logger log;
    if (argc == 1)
    {
        log.Info("Welcome to the main program. Type -h or --help to learn more");
    }

    for (int i = 0; i < argc; i++)
    {
        if (std::string(argv[i]) == "-h" || std::string(argv[i]) == "--help")
        {
            log.Info("Option -v to start video");
            log.Info("Option -m to connect modem");
            log.Info("Option -w <connect | disconnect> to connect vpn");
            log.Info("Option -t <start | stop> to start/stop telemetry");
            log.Info("Option -a to autostart all");
            log.Info("Option -s to stop all services\n\n");
            log.Info("Option -p to resart server with new web-port\n\n");
            log.Info("author: Bernt Christian Egeland / uavmatrix.com\n");
        }
        if (std::string(argv[i]) == "-a" || std::string(argv[i]) == "--a")
        {
            auto_start();
        }
        if (std::string(argv[i]) == "-s" || std::string(argv[i]) == "--s")
        {
            stop_all();
        }

        /*
        Start mavlink
        */
        if (std::string(argv[i]) == "-t" || std::string(argv[i]) == "--t")
        {
            if (!argv[i + 1])
            {
                log.Warn("No option was passed!  USAGE: -t <start | stop> to start/stop telemetry");
                return -1;
            }

            if (strcmp(argv[i + 1], "start") == 0)
            {
                return mavlink.connect();
            }

            if (strcmp(argv[i + 1], "stop") == 0)
            {
                return mavlink.disconnect();
            }

            // LOG("No option was passed!  USAGE: -t <start | stop> to start/stop telemetry" <<  "")
            return 0;
        }
        /* 
        Start video
        */
        if (std::string(argv[i]) == "-v" || std::string(argv[i]) == "--v")
        {
            if (!argv[i + 1])
            {
                log.Warn("No option was passed!  USAGE: -v <start | stop> to start/stop video");
                return -1;
            }

            if (strcmp(argv[i + 1], "start") == 0)
            {
                utils.exec("sudo systemctl start uavcast-camera");
                log.Info("Video started!");
            }

            if (strcmp(argv[i + 1], "stop") == 0)
            {
                utils.exec("sudo systemctl stop uavcast-camera");
                log.Info("Video stopped!");
            }

            // LOG("No option was passed!  USAGE: -t <start | stop> to start/stop telemetry" <<  "")
            return 0;
        }

        // Modem
        if (std::string(argv[i]) == "-m" || std::string(argv[i]) == "--m")
        {
            modem.connect();
        }
         // Server
        if (std::string(argv[i]) == "-p" || std::string(argv[i]) == "--p")
        {
            app.serverport();
        }
    }

    return 0;
}
