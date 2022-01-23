
#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include "db.h"
#include "mavlink.h"
#include "utils.h"
#include <chrono>
#include <thread>
#include <fstream>

int Mavlink::disconnect()
{
    Utils utils;
    std::string mavlink_active = utils.exec("sudo systemctl is-active mavlink-router");
    if (utils.isWordPresent(mavlink_active, "active"))
    {
        //We should stop all active mavlinks
        std::cout << "mavlink active, stopping service" << '\n';

        try
        {
            utils.exec("sudo systemctl stop mavlink-router");
        }
        catch (const std::exception &e)
        {
            std::cerr << e.what() << '\n';
            std::cout << "could not stop mavlink router!" << '\n';
        }
        // Try 3 times to stop mavlink
        int attempts = 3;
        for (size_t i = attempts; i < 3; i++)
        {
            utils.exec("sudo systemctl stop mavlink-router");
            mavlink_active = utils.exec("sudo systemctl is-active mavlink-router");

            if (!utils.isWordPresent(mavlink_active, "active"))
                break;

            std::cout << i << " attempts to stopp mavlink!" << '\n';

            if ((i = attempts))
            {
                std::cout << i << " could not stop mavlink!. quitting!" << '\n';
                return 1;
            }

            std::this_thread::sleep_for(std::chrono::seconds(2));
        }
    }
    return 0;
}
int Mavlink::ardupilot(FlightControllerRecords fc_record)
{
    Database db;
    Utils utils;
    Mavlink mav;
    std::string mavlink_active;

    mavlink_active = utils.exec("sudo systemctl is-active mavlink-router");
    if (utils.isWordPresent(mavlink_active, "active"))
    {
        mav.disconnect();
    }

    EndpointRecords endpoints = db.get_endpoints();
    std::string clients;

    std::ofstream MavConfigFile("/etc/mavlink-router/main.conf");
    MavConfigFile << "[General]\n";

    if (!fc_record.size())
    {
        std::cout << "No data in FlightController DB. Please configure data from webinterface!" << '\n';
        return -1;
    }

    // Add loging if selected!
    if (fc_record[0].binFlightLog == 1)
    {
        MavConfigFile << "  Log=/app/uavcast/data/log/mavlink/flight\n";
        MavConfigFile << "  MavlinkDialect=ardupilotmega\n";
    }

    MavConfigFile << "  TcpServerPort=" + fc_record[0].tcpPort << "\n";
    MavConfigFile << "  ReportStats=false\n";
    MavConfigFile << "  MavlinkDialect=auto\n";
    MavConfigFile << "\n";
    MavConfigFile << "[UartEndpoint controller]\n";
    MavConfigFile << "  Device=" + fc_record[0].internalAddress << "\n";
    MavConfigFile << "  Baud=" + fc_record[0].baudRate << "\n";
    MavConfigFile << "\n";
    MavConfigFile << "[UdpEndpoint localhost]\n";
    MavConfigFile << "  Mode=Normal\n";
    MavConfigFile << "  Address=127.0.0.1\n";
    MavConfigFile << "  Port=12550\n";
    MavConfigFile << "\n";

    for (auto i = 0u; i < endpoints.size(); i++)
    {
        if (endpoints[i].telemEnable == 0)
            continue;

        MavConfigFile << "[UdpEndpoint " + endpoints[i].endpointIPaddress << "]\n";
        MavConfigFile << "  Mode=Normal"
                      << "\n";
        MavConfigFile << "  Address=" + endpoints[i].endpointIPaddress << "\n";
        MavConfigFile << "  Port=" + std::to_string(endpoints[i].telemetryPort) << "\n";
        MavConfigFile << "\n";
    }

    MavConfigFile.close();

    std::cout << "Mavlink is starting.." << '\n';
    // start mavlink
    utils.exec("sudo systemctl start mavlink-router");
    std::this_thread::sleep_for(std::chrono::seconds(1));

    mavlink_active = utils.exec("sudo systemctl is-active mavlink-router");
    if (utils.isWordPresent(mavlink_active, "active"))
    {
        std::cout << "Mavlink has started!" << '\n';
        return 0;
    }
    std::cout << mavlink_active << '\n';
    return 0;

}
int Mavlink::navio(FlightControllerRecords fc_record)
{
    std::cout << fc_record[0].controller << '\n';
    return 1;
}

int Mavlink::connect()
{
    Database db;

    // Get FC vlaues
    FlightControllerRecords fc_record = db.get_flightcontroller();

    if(fc_record[0].controller == "apm"){
        return ardupilot(fc_record);
    }

    if(fc_record[0].controller == "navio"){
        return navio(fc_record);
    }

    return 0;
}