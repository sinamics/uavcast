#pragma once
#include <vector>
#include <string>
#include <iostream>
#include "sqlite3.h"

struct global_values
{
    int id;
    int useVpn;
    int useModem;
};
struct app_values
{
    int hasBeenUpdated;
    int remoteVersionFetched;
    int webPort;
};

struct modem_values
{
    int id;
    int enableModem;
    int modemInformation;
    std::string modemType;
    std::string modemInterface;
    std::string internalAddress;
    std::string pinCode;
    std::string username;
    std::string password;
};
struct vpn_values
{
    int id;
    int enableVpn;
    std::string serviceProvider;
    std::string username;
    std::string password;
};

struct camera_values
{
    int id;
    std::string cameraType;
    int enableCamera;
    std::string protocol;
    std::string resolution;
    std::string customPipeline;
    int framesPrSecond;
    int bitratePrSecond;
    float contrast;
    int rotation;
    float brightness;
    std::string whiteBalance;
    std::string flipCamera;
    std::string format;
};

struct fc_values
{
    std::string controller;
    std::string protocol;
    std::string connectionType;
    std::string internalAddress;
    std::string baudRate;
    std::string tcpPort;
    int binFlightLog;
};

struct endpoint_values
{
    int telemEnable;
    int moduleActive;
    std::string name;
    std::string endpointIPaddress;
    int telemetryPort;
    int videoPort;
    int videoEnable;
};

using EndpointRecords = std::vector<endpoint_values>;
using FlightControllerRecords = std::vector<fc_values>;
using VpnRecords = std::vector<vpn_values>;
class Database
{
private:
    int connect_db();
    int close_db();

public:
    int get_application(app_values *app);
    int get_global(global_values *global);
    // VpnRecords get_vpn();
    int get_modem(modem_values *modem);
    int get_vpn(vpn_values *vpn);
    int get_camera(camera_values *camera);
    EndpointRecords get_endpoints();
    FlightControllerRecords get_flightcontroller();
};
