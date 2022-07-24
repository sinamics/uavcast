
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
    string rtsp_enabled = utils.exec("sudo docker inspect -f {{.State.Running}} rtsp_server 2>/dev/null");
    if (utils.isWordPresent(rtsp_enabled, "true"))
    {
        status["video"] = true;
    }
    string gst_enabled = utils.exec("sudo docker inspect -f {{.State.Running}} gst_server 2>/dev/null");
    if (utils.isWordPresent(gst_enabled, "true"))
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
    db_modem db_modem_obj;
    db.get_modem(&db_modem_obj);

    string pingCmd = "timeout 0.2 ping 8.8.8.8 -q -c1 -w 1 -I " + db_modem_obj.modemInterface + " > /dev/null 2>&1";
    const char *pingC = pingCmd.c_str();
    // std::cout << db_modem_obj.enableModem << std::endl;

    // if (db_modem_obj.enableModem.empty() == 0 && std::stoi(db_modem_obj.enableModem))
    if (db_modem_obj.enableModem)
    {
        if (system(pingC) == 0)
        {
            status["modem"] = true;
        }
    }

    // Get vpn db values
    db_vpn db_vpn_obj;
    db.get_vpn(&db_vpn_obj);
    // log.Info(std::to_string(db_vpn_obj.enableVpn).c_str());

    // if (db_vpn_obj.enableVpn)
    // {

        if(db_vpn_obj.serviceProvider == "zerotier"){
            string vpn_active = utils.exec("sudo zerotier-cli listnetworks");
            if (utils.isWordPresent(vpn_active, "OK"))
            {
                status["vpn"] = true;
            }
        }
        if(db_vpn_obj.serviceProvider == "openvpn"){
            string vpn_active = utils.exec("sudo systemctl is-active uavcast-vpn");
            if (utils.isWordPresent(vpn_active, "active"))
            {
                status["vpn"] = true;
            }
        }
    // }

    // paste <(cat /sys/class/thermal/thermal_zone*/type) <(cat /sys/class/thermal/thermal_zone*/temp) | column -s $'\t' -t | sed 's/\(.\)..$/.\1°C/'
    cout << fastWriter.write(status) << endl;
}