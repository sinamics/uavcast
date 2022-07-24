#include <dirent.h>
#include <string>
#include <stdlib.h>
#include <stdio.h>
#include <bits/stdc++.h>
#include <sys/stat.h>
#include "utils.h"
#include <jsoncpp/json/json.h>
#include <curl/curl.h>

#include <sys/types.h>
#include <ifaddrs.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int Utils::getProcIdByName(std::string procName)
{
    int pid = -1;

    // Open the /proc directory
    DIR *dp = opendir("/proc");
    if (dp != NULL)
    {
        // Enumerate all entries in directory until process found
        struct dirent *dirp;
        while (pid < 0 && (dirp = readdir(dp)))
        {
            // Skip non-numeric entries
            int id = atoi(dirp->d_name);
            if (id > 0)
            {
                // Read contents of virtual /proc/{pid}/cmdline file
                std::string cmdPath = std::string("/proc/") + dirp->d_name + "/cmdline";
                std::ifstream cmdFile(cmdPath.c_str());
                std::string cmdLine;
                std::getline(cmdFile, cmdLine);
                if (!cmdLine.empty())
                {
                    // Keep first cmdline item which contains the program path
                    size_t pos = cmdLine.find('\0');
                    if (pos != std::string::npos)
                        cmdLine = cmdLine.substr(0, pos);
                    // Keep program name only, removing the path
                    pos = cmdLine.rfind('/');
                    if (pos != std::string::npos)
                        cmdLine = cmdLine.substr(pos + 1);
                    // Compare against requested process name
                    if (procName == cmdLine)
                        pid = id;
                }
            }
        }
    }

    closedir(dp);

    return pid;
}
// Function that returns true if the word is found
bool Utils::isWordPresent(std::string sentence, std::string word)
{
    // To break the sentence in words
    std::stringstream s(sentence);

    // To temporarily store each individual word
    std::string temp;

    while (s >> temp)
    {

        // Comparing the current word
        // with the word to be searched
        if (temp.compare(word) == 0)
        {
            return true;
        }
    }
    return false;
}

// Returns output to console
std::string Utils::exec(const char *cmd)
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

// Does not output to console in some situations.
std::string Utils::exec_p(const char *cmd)
{
   FILE* fp;
    char* result = NULL;
    size_t len = 0;

    fflush(NULL);
    fp = popen(cmd, "r");
    if (fp == NULL) {
        printf("Cannot execute command:\n%s\n", cmd);
        throw std::runtime_error("command failed!");
    }

    while(getline(&result, &len, fp) != -1) {
        fputs(result, stdout);
    }

    free(result);
    fflush(fp);
    if (pclose(fp) != 0) {
        perror("Cannot close stream.\n");
    }
    return result;
}
bool Utils::to_bool(std::string const &s)
{
    return s != "0";
}

bool Utils::file_exsist(const std::string &name)
{
    struct stat buffer;
    return (stat(name.c_str(), &buffer) == 0);
}

std::vector<std::string> Utils::split(const std::string str, char delim)
{
    std::vector<std::string> result;
    std::istringstream ss{str};
    std::string token;
    while (std::getline(ss, token, delim))
    {
        if (!token.empty())
        {
            result.push_back(token);
        }
    }
    return result;
}


std::size_t json_callback(
            const char* in,
            std::size_t size,
            std::size_t num,
            std::string* out)
    {
        const std::size_t totalBytes(size * num);
        out->append(in, totalBytes);
        return totalBytes;
    }

Json::Value Utils::http_get_json(std::string url)
{
    // const std::string url(url);

    CURL* curl = curl_easy_init();

    // Set remote URL.
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

    // Response information.
    long httpCode(0);

    std::string httpData;
    // Hook up data handling function.
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, json_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &httpData);

    // Run our HTTP GET command, capture the HTTP response code, and clean up.
    curl_easy_perform(curl);
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
    curl_easy_cleanup(curl);

    if (httpCode != CURLE_HTTP_RETURNED_ERROR)
    {
        // Response looks good - done using Curl now.  Try to parse the results
        // and print them out.
        Json::Value jsonData;
        JSONCPP_STRING jsonError;
        Json::CharReaderBuilder builder;

        const std::unique_ptr<Json::CharReader> reader(builder.newCharReader());

        if (reader->parse(httpData.c_str(), httpData.c_str() + httpData.length(), &jsonData, &jsonError))
        {
            const Json::Value resultValue = jsonData;
            return jsonData;
            // const Json::Value resultValue = jsonData["results"][0]["name"];
            // return resultValue.asString();
        }
        else
        {
            std::cout << "Could not parse HTTP data as JSON" << std::endl;
            return {};
        }
    }
    else
    {
        std::cout << "Couldn't GET from " << url << " - exiting" << std::endl;
        return {};
    }
}

std::vector<std::string> Utils::local_ip()
{
    struct ifaddrs * ifAddrStruct=NULL;
    struct ifaddrs * ifa=NULL;
    void * tmpAddrPtr=NULL;

    std::vector<std::string> ip_list;

    getifaddrs(&ifAddrStruct);

    for (ifa = ifAddrStruct; ifa != NULL; ifa = ifa->ifa_next) {
        if (!ifa->ifa_addr) {
            continue;
        }
        if (ifa->ifa_addr->sa_family == AF_INET) { // check it is IP4
            // is a valid IP4 Address
            tmpAddrPtr=&((struct sockaddr_in *)ifa->ifa_addr)->sin_addr;
            char addressBuffer[INET_ADDRSTRLEN];
            inet_ntop(AF_INET, tmpAddrPtr, addressBuffer, INET_ADDRSTRLEN);

            if(std::string(ifa->ifa_name).find("eth") != std::string::npos || std::string(ifa->ifa_name).find("wlan") != std::string::npos || std::string(ifa->ifa_name).find("usb") != std::string::npos){
                // printf("rtsp://%s%s", addressBuffer , ":8554/uavcast\n");
                ip_list.push_back(addressBuffer);
            }
        }
        // else if (ifa->ifa_addr->sa_family == AF_INET6) { // check it is IP6
        //     // is a valid IP6 Address
        //     tmpAddrPtr=&((struct sockaddr_in6 *)ifa->ifa_addr)->sin6_addr;
        //     char addressBuffer[INET6_ADDRSTRLEN];
        //     inet_ntop(AF_INET6, tmpAddrPtr, addressBuffer, INET6_ADDRSTRLEN);
        //     printf("%s IP Address %s\n", ifa->ifa_name, addressBuffer);
        // }
    }
    if (ifAddrStruct!=NULL) freeifaddrs(ifAddrStruct);
    return ip_list;
}

std::string Utils::trim(std::string str)
{
    if (!str.empty() && str[str.length()-1] == '\n') {
        str.erase(str.length()-1);
    }
    return str;
}