
#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include "db.h"
#include "modem.h"
#include "logger.h"
#include "utils.h"
#include <chrono>
#include <thread>

// sudo apt-get install libmm-glib-dev
// sudo apt-get install libglib2.0-dev
// sudo apt-get install libnm-util-dev
std::string Modem::exec(const char *cmd)
{
    char buffer[128];
    std::string result = "";
    FILE *pipe = popen(cmd, "r");
    if (!pipe)
        throw std::runtime_error("popen() failed!");
    try
    {
        while (fgets(buffer, sizeof buffer, pipe) != NULL)
        {
            result += buffer;
        }
    }
    catch (...)
    {
        pclose(pipe);
        throw;
    }
    pclose(pipe);
    return result;
}

int Modem::connect(){
    Database db;
    Utils utils;
    Logger log;

    modem_values modem_val;
    db.get_modem(&modem_val);

    Modem modem;
    if (modem_val.enableModem)
    {
        if(modem_val.modemType == "stick"){
            log.Info("stick modem");
            int res = modem.connectWithModemManager();
            if(res == -1){
                log.Error("failed to start modem!");
            }

        }
        if(modem_val.modemType == "hilink"){
            std::string hilinkInt = std::string("/sbin/ifconfig ") + modem_val.modemInterface +
                                    std::string(" | grep 'inet' | wc -l");

            std::string nic = utils.exec(hilinkInt.c_str());
            if(nic != "1"){
                log.Info("hilink modem found");
            } else {

                log.Error("hilink modem not found!");
            }
        }
    }
    return 0;
}
int Modem::connectWithModemManager()
{
    Database db;
    Logger log;
    modem_values modem_val;
    db.get_modem(&modem_val);

    log.Info("Starting ModemManager");


    std::string con_string;
    con_string =
        std::string("sudo mmcli -m 0 --simple-connect='pin=") + modem_val.pinCode +
        std::string(",user=") + modem_val.username +
        std::string(",password=") + modem_val.password +
        std::string(",ip-type=ipv4'");


    int x = 0;
    while ( x < 15  ) {
        std::string checkMdm = Modem::exec("sudo mmcli -L | grep 'No modems'");
        if (checkMdm.compare("No modems were found") == 0){
            Modem::exec("sudo mmcli -m 0 -e");
            Modem::exec(con_string.c_str());
            log.Info("Modem ready, connecting...");

            break;
        }

        log.Error("Modem not ready, retries in 10sec...");

        std::this_thread::sleep_for(std::chrono::seconds(10));
        x++;
    }
    return 0;
}