
#include <iostream>
#include <stdio.h>
#include <string>
#include "db.h"
#include "utils.h"
#include "app.h"

int App::serverport()
{
    Utils utils;
    Database db;
    app_values app;
    db.get_application(&app);

    if(app.webPort < 1) {
        std::cout << ">> Invalid port number! Database does probably not exsist! First startup?" << '\n';
        return 1;
    }

    //Change the port number in systemd.
    std::string sed = 
        std::string("sudo sed -ri 's/(SERVER_PORT)(=.*)/\\1=") + std::to_string(app.webPort) +
        std::string("\"/' /etc/systemd/system/uavcast-web.service");

    utils.exec_p(sed.c_str());
    std::cout << ">> WebPort changed" << '\n';

    //restart docker container
    // std::string systemd = "docker restart uavcast";
    // utils.exec_p(systemd.c_str());
    return 0;
}