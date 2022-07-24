#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include "db.h"
#include "flight_controller.h"

FlightControllerRecords FlightController::get_flight_controller()
{
    Database db;
    db_flight_controller fc_value;
    FlightControllerRecords fc_record = db.get_flightcontroller();

    return {};
};