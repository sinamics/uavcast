#pragma once
#include <vector>
#include <string>
#include <iostream>
#include "sqlite3.h"

struct db_global
{
    int id;
    int useVpn;
    int useModem;
};
struct db_app
{
    int hasBeenUpdated;
    int remoteVersionFetched;
    int webPort;
};

struct db_modem
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
struct db_vpn
{
    int id;
    int enableVpn;
    std::string serviceProvider;
    std::string username;
    std::string password;
};

struct db_camera
{
    int id;
    std::string path;
    std::string name;
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

struct db_flight_controller
{
    std::string controller;
    std::string protocol;
    std::string connectionType;
    std::string internalAddress;
    std::string baudRate;
    std::string tcpPort;
    int binFlightLog;
};

struct db_endpoint
{
    int telemEnable;
    int moduleActive;
    std::string name;
    std::string endpointIPaddress;
    int telemetryPort;
    int videoPort;
    int videoEnable;
};

struct db_logger
{
    int debug;
};


using EndpointRecords = std::vector<db_endpoint>;
using FlightControllerRecords = std::vector<db_flight_controller>;
using VpnRecords = std::vector<db_vpn>;
class Database
{
private:
    int connect_db();
    int close_db();

public:
    int get_application(db_app *app);
    int get_global(db_global *global);
    // VpnRecords get_vpn();
    int get_modem(db_modem *modem);
    int get_vpn(db_vpn *vpn);
    int get_camera(db_camera *camera);
    EndpointRecords get_endpoints();
    FlightControllerRecords get_flightcontroller();
    int get_logger(db_logger *log);

};
