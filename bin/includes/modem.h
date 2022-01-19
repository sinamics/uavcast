#pragma once
#include <string>

class Modem
{

public:
    std::string exec(const char *cmd);
    int connectWithModemManager();
    int connect();
    std::string get_modem(modem_values *modem);
};