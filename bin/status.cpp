
#include <dirent.h>
#include <errno.h>
#include <string>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <bits/stdc++.h>
#include "includes/db.h"
#include "includes/modem.h"
#include <jsoncpp/json/json.h> // sudo apt-get install libjsoncpp-dev
#include <sys/stat.h>
#include <unistd.h>
#include <fstream>
#include "includes/utils.h"
// #include "includes/vpn.h"

using namespace std;

// 0: under-voltage
// 1: arm frequency capped
// 2: currently throttled
// 16: under-voltage has occurred
// 17: arm frequency capped has occurred
// 18: throttling has occurred

// if (i & 1<<0) printf("Under-voltage detected\n");
//   if (i & 1<<1) printf("Arm frequency capped\n");
//   if (i & 1<<2) printf("Currently throttled\n");
//   if (i & 1<<3) printf("Soft temperature limit active\n");
//   if (i & 1<<16) printf("Under-voltage has occurred\n");
//   if (i & 1<<17) printf("Arm frequency capped has occurred\n");
//   if (i & 1<<18) printf("Throttling has occurred\n");
//   if (i & 1<<19) printf("Soft temperature limit has occurred\n");

int main()
{
    Database db;
    Utils utils;
    // Json::StyledWriter styledWriter;
    Json::FastWriter fastWriter;
    Json::Value status;

    status["arch"] = utils.exec("uname -m");
    status["mavproxy"] = false;
    status["has_camera"] = false;
    status["video"] = false;
    status["modem"] = false;
    status["uavcast_systemd_active"] = false;
    status["uavcast_systemd_enabled"] = false;
    status["vpn"] = false;
    status["undervoltage"] = false;

    //!armv6l armv7l armv8l
    // We ahve a raspbian most likely
    // if (status["arch"].asString().find("armv") != std::string::npos)
    // {
    //     // Get undervoltage
    //     string vcgencmd = utils.exec("sudo vcgencmd get_throttled");
    //     int vcgencmdCapped = std::stoi(vcgencmd.substr(vcgencmd.find("=") + 1), NULL, 16);
    //     if (vcgencmdCapped & 1 << 0 || vcgencmdCapped & 1 << 18)
    //     {
    //         status["undervoltage"] = true;
    //     }

    //     // Get undervoltage
    //     string get_camera = utils.exec("vcgencmd get_camera | grep detected=1");
    //     if (get_camera.length() != 0)
    //     {
    //         status["has_camera"] = true;
    //     }
    // }

    //!aarch64
    // We ahve a 64bit ubuntu most likely
    if (status["arch"].asString().find("aarch64") != std::string::npos)
    {
    }

    // Get systemctl is-active UAVcast
    string uavcast_active = utils.exec("sudo systemctl is-active uavcast");
    if (utils.isWordPresent(uavcast_active, "active"))
    {
        status["uavcast_systemd_active"] = true;
    }

    // Check if video is running
    string camera_enabled = utils.exec("sudo systemctl is-active uavcast-camera");
    if (utils.isWordPresent(camera_enabled, "active"))
    {
        status["video"] = true;
    }

    // Get systemctl is - enabled UAVcast
    string uavcast_enabled = utils.exec("sudo systemctl is-enabled uavcast");
    if (utils.isWordPresent(uavcast_enabled, "enabled"))
    {
        status["uavcast_systemd_enabled"] = true;
    }

    // Get systemctl is - active mavlink-router
    string mavlink_active = utils.exec("sudo systemctl is-active mavlink-router");
    if (utils.isWordPresent(mavlink_active, "active"))
    {
        status["mavproxy"] = true;
    }

    // Get modem interface and check if online
    modem_values modem_val;
    db.get_modem(&modem_val);

    string pingCmd = "timeout 0.2 ping 8.8.8.8 -q -c1 -w 1 -I " + modem_val.modemInterface + " > /dev/null 2>&1";
    const char *pingC = pingCmd.c_str();
    // std::cout << modem_val.enableModem << std::endl;

    // if (modem_val.enableModem.empty() == 0 && std::stoi(modem_val.enableModem))
    if (modem_val.enableModem)
    {
        if (system(pingC) == 0)
        {
            status["modem"] = true;
        }
    }

    // Get vpn vlaues
    vpn_values vpn_val;
    db.get_vpn(&vpn_val);

    if(vpn_val.enableVpn){

        if(vpn_val.serviceProvider == "zerotier"){
            string vpn_active = utils.exec("sudo zerotier-cli listnetworks");
            if (utils.isWordPresent(vpn_active, "OK"))
            {
                status["vpn"] = true;
            }
        }
        if(vpn_val.serviceProvider == "openvpn"){
            string vpn_active = utils.exec("sudo systemctl is-active uavcast-vpn");
            if (utils.isWordPresent(vpn_active, "active"))
            {
                status["vpn"] = true;
            }
        }
    }

    // paste <(cat /sys/class/thermal/thermal_zone*/type) <(cat /sys/class/thermal/thermal_zone*/temp) | column -s $'\t' -t | sed 's/\(.\)..$/.\1°C/'
    cout << fastWriter.write(status) << endl;
}