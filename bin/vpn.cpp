#include <iostream>
#include <fstream>
#include "includes/db.h"
#include "includes/utils.h"
#include <string.h>

int openvpn()
{
    Database db;
    Utils utils;
    
    vpn_values vpn_val;
    db.get_vpn(&vpn_val);
    std::string vpn_connect_str;
        // std::cout << vpn_val.enableVpn << '\n';

    if (vpn_val.serviceProvider == "openvpn")
    {   
       
        std::cout << ">> generates configuration files.." << '\n';
        // Generate password file 
        std::ofstream OpenVpnPassFile("/app/uavcast/etc/login.txt");
        OpenVpnPassFile << vpn_val.username << "\n";
        OpenVpnPassFile << vpn_val.password;
        OpenVpnPassFile.close();

        vpn_connect_str =
            std::string("sudo openvpn --config /app/uavcast/etc/openvpn.conf --auth-user-pass /app/uavcast/etc/login.txt");

        std::string vpn_connect = utils.exec_p(vpn_connect_str.c_str());
        std::cout << vpn_connect << '\n';
    }
    return 0;
}
int main(int argc, char *argv[])
{
    if (argc == 1)
    {
        std::cout << "Welcome to the vpn app. Type -h or --help to learn more\n";
    }

    for (int i = 0; i < argc; i++)
    {
        if (std::string(argv[i]) == "-h" || std::string(argv[i]) == "--help")
        {
            std::cout << "Option -o <openvpn> to connect vpn\n";
            std::cout << "author: Bernt Christian Egeland / uavmatrix.com\n\n";
        }

         /*
        Start vpn
        */
        if (std::string(argv[i]) == "-o" || std::string(argv[i]) == "--o")
        {
            if (!argv[i + 1])
            {
                std::cout << "No option was passed!  USAGE: -t <start | stop> to start/stop telemetry\n";
                return -1;
            }

            if (strcmp(argv[i + 1], "start") == 0)
            {
                return openvpn();
            }


            // std::cout << "No option was passed!  USAGE: -t <start | stop> to start/stop telemetry" <<  "\n";
            return 0;
        }
    }

    return 0;
}