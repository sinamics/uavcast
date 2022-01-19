#pragma once
#include <string>
#include <vector>

class Utils
{

public:
    int getProcIdByName(std::string procName);
    bool isWordPresent(std::string sentence, std::string word);
    std::string exec_p(const char *cmd);
    std::string exec(const char *cmd);
    bool to_bool(std::string const &s);
    bool file_exsist(const std::string &name);
    std::vector<std::string> split(const std::string str, char delim);
};