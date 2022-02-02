#pragma once
#include <string>
#include <vector>
#include <jsoncpp/json/json.h>
#include <curl/curl.h>

class Utils
{

public:
    int getProcIdByName(std::string procName);
    bool isWordPresent(std::string sentence, std::string word);
    std::string exec_p(const char *cmd);
    std::string exec(const char *cmd);
    Json::Value http_get_json(std::string cmd);
    bool to_bool(std::string const &s);
    bool file_exsist(const std::string &name);
    std::vector<std::string> split(const std::string str, char delim);
    std::vector<std::string> local_ip();
};