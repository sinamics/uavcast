
#include <iostream>
#include <stdio.h>
#include <string>
#include "db.h"
#include "utils.h"
#include "app.h"
#include <cstdlib>

int App::serverport()
{
    Utils utils;
    Database db;
    db_app app_obj;
    db.get_application(&app_obj);

    if(app_obj.webPort < 2 || app_obj.webPort > 65000) {
        std::cout << ">> Invalid port number " << app_obj.webPort <<
        " Database does probably not exsist! First startup?" << '\n';
        return 1;
    }

    //Change the port number in systemd.
    std::string sed =
        std::string("sudo sed -ri 's/(SERVER_PORT)(=.*)/\\1=") + std::to_string(app_obj.webPort) +
        std::string("\"/' /etc/systemd/system/uavcast-web.service");

    utils.exec_p(sed.c_str());
    std::cout << ">> WebPort changed " << app_obj.webPort << '\n';

    return 0;
}