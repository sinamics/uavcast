#pragma once
#include <string>

class Mavlink
{

public:
    int disconnect();
    int connect();
    int navio(FlightControllerRecords fc_val);
    int ardupilot(FlightControllerRecords fc_val);
};