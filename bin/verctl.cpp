#include <iostream>
#include <string>
#include <curl/curl.h>
#include "includes/utils.h"
#include <jsoncpp/json/json.h> // sudo apt-get install libjsoncpp-dev
#include <cstring>
#include <regex>
// apt-get install libcurl4-gnutls-dev
// apt-get install libcurl4-nss-dev

using namespace std;

bool string2bool(const std::string & v)
{
    return !v.empty () &&
        (strcasecmp (v.c_str (), "true") == 0 ||
         atoi (v.c_str ()) != 0);
}
bool isNumber(const string& str)
{
    for (char const &c : str) {
        if (std::isdigit(c) == 0) return false;
    }
    return true;
}
bool is_number(const std::string& s)
{
    return !s.empty() && std::find_if(s.begin(),
        s.end(), [](unsigned char c) { return !std::isdigit(c); }) == s.end();
}
static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
{
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}
int extractIntegerWords(string str)
{

    std::string output = std::regex_replace(
        str,
        std::regex("[^0-9]"),
        std::string("$1")
        );
    if(is_number(output)){
        return std::stoi(output);
    }
    return 0;
}

string trim(string str)
{
    if (!str.empty() && str[str.length()-1] == '\n') {
        str.erase(str.length()-1);
    }
    return str;
}
// SUPERVISOR
bool supervisor_isRunning()
{
    Utils utils;

    string isRunning = utils.exec("sudo docker container inspect -f '{{.State.Running}}' supervisor");
    return trim(isRunning) == "true" ? true : false;
};
int get_dockerhub_supervisor_versions()
{
    CURL *curl;
    std::string readBuffer;

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://registry.hub.docker.com/v2/repositories/sinamics/uavcast-supervisor/tags");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        std::cout << readBuffer << std::endl;
    }
  return 0;
};
string get_running_supervisor_version()
{
    Utils utils;

    string uavcast_version = utils.exec("docker ps -f name=^/supervisor$ | grep -w supervisor | awk '{print $2}'");
    if(trim(uavcast_version) == ""){
        static const char s[] = "supervisor not running";
        return s;
    }
    string version = uavcast_version.substr(uavcast_version.find(":") + 1);
    // std::cout << version << std::endl;
    return trim(version);
};

string get_dockerhub_latest_supervisor_version()
{
    CURL *curl;
    // CURLcode res;
    std::string json;
    Json::Reader reader;
    Json::Value val;

    // Json::Value json;
    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://hub.docker.com/v2/repositories/sinamics/uavcast-supervisor/tags?page_size=100");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &json);
        // res = curl_easy_perform(curl);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        bool parseSuccess = reader.parse(json,  val);
        if (parseSuccess)
        {
            const Json::Value resultValue = val["results"][0]["name"];
            // std::cout << resultValue.asString() << std::endl;
            return resultValue.asString();
        }
    }
    return {};
};
int get_supervisor_app_information()
{
    Json::FastWriter fastWriter;
    Json::Value uavcast;

    string remote_version = get_dockerhub_latest_supervisor_version();
    string running_version = get_running_supervisor_version();
    // std::cout << running_version << std::endl;

    uavcast["repo"] = "supervisor";
    uavcast["isRunning"] = supervisor_isRunning();
    uavcast["remoteVersion"] = remote_version;
    uavcast["localVersion"] = running_version;
    uavcast["hasLatest"] = extractIntegerWords(running_version) >= extractIntegerWords(remote_version);

    cout << fastWriter.write(uavcast) << endl;
    return 0;
}

// UAVCAST
bool uavcast_isRunning()
{
    Utils utils;

    string isRunning = utils.exec("sudo docker container inspect -f '{{.State.Running}}' uavcast");
    return trim(isRunning) == "true" ? true : false;
};

string get_running_uavcast_version()
{
    Utils utils;

    string uavcast_version = utils.exec("docker ps -f name=^/uavcast$ | grep -w uavcast | awk '{print $2}'");
    if(uavcast_version == ""){
        static const char s[] = "uavcast not running";
        return s;
    }
    int chkver = uavcast_version.find(":");
    if(chkver == -1) return "uavcast not running";

    string version = uavcast_version.substr(uavcast_version.find(":") + 1);
    // std::cout << version << std::endl;

    return trim(version);
};



int get_dockerhub_uavcast_versions()
{
    CURL *curl;
    // CURLcode res;
    std::string readBuffer;

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://registry.hub.docker.com/v2/repositories/sinamics/uavcast/tags");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        // res = curl_easy_perform(curl);
        curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        std::cout << readBuffer << std::endl;
    }
  return 0;
};
string get_dockerhub_latest_uavcast_version()
{
    CURL *curl;
    // CURLcode res;
    std::string json;
    Json::Reader reader;
    Json::Value val;

    // Json::Value json;
    curl = curl_easy_init();
    if(curl) {

        try {
            curl_easy_setopt(curl, CURLOPT_URL, "https://hub.docker.com/v2/repositories/sinamics/uavcast/tags?page_size=100");
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(curl, CURLOPT_WRITEDATA, &json);
            // res = curl_easy_perform(curl);
            curl_easy_perform(curl);
            curl_easy_cleanup(curl);
            bool parseSuccess = reader.parse(json,  val);
            if (parseSuccess)
            {
                const Json::Value resultValue = val["results"][0]["name"];
                // std::cout << resultValue.asString() << std::endl;
                return resultValue.asString();
            }
        }
        catch (int error) {
            // Block of code to handle errors
            std::cout << "an error occured. get_dockerhub_latest_uavcast_version" << std::endl;
        }
    }
    return "";
};
int get_uavcast_app_information()
{
    Json::FastWriter fastWriter;
    Json::Value uavcast;

    string remote_version = get_dockerhub_latest_uavcast_version();
    string running_version = get_running_uavcast_version();

    uavcast["repo"] = "uavcast";
    uavcast["isRunning"] = uavcast_isRunning();
    uavcast["remoteVersion"] = remote_version;
    uavcast["localVersion"] = running_version;
    uavcast["hasLatest"] = extractIntegerWords(running_version) >= extractIntegerWords(remote_version);

    cout << fastWriter.write(uavcast) << endl;
    return 0;
}

int main(int argc, char *argv[])
{
    if (argc == 1)
    {
        std::cout << "Version manager for uavcast. Type -h or --help to learn more\n";
    }

    for (int i = 0; i < argc; i++)
    {
        if (std::string(argv[i]) == "-h" || std::string(argv[i]) == "--help")
        {
            std::cout << "Option -uavcast\n";
            std::cout << "Option -uavcastinformation\n";
            std::cout << "Option -supervisor\n";
            std::cout << "Option -supervisorinformation\n\n\n";
            std::cout << "author: Bernt Christian Egeland / uavmatrix.com\n\n";
        }

        if (std::string(argv[i]) == "-uavcast")
        {
            get_dockerhub_uavcast_versions();
        }
        if (std::string(argv[i]) == "-uavcastinformation")
        {
            get_uavcast_app_information();
        }
        if (std::string(argv[i]) == "-supervisor")
        {
            get_dockerhub_supervisor_versions();
        }
         if (std::string(argv[i]) == "-supervisorinformation")
        {
            get_supervisor_app_information();
        }
    }
}