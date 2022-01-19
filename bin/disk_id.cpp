#include <iostream>
#include <fstream>

int main()
{

    std::string SSD = "/sys/block/sda/device/wwid";
    std::string SD = "/sys/block/mmcblk0/device/cid";
    try
    {
        std::ifstream sd(SD.c_str());
        if (sd.is_open())
        {
            std::cout << sd.rdbuf();
            exit(0);
        }

        std::ifstream ssd(SSD.c_str());
        if (ssd.is_open())
        {
            std::cout << ssd.rdbuf();
            exit(0);
        }

        throw std::invalid_argument("Could not find a valid disk!");
    }
    catch (const std::exception &e)
    {
        std::cerr << e.what() << '\n';
    }
}