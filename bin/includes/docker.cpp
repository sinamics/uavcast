/****
 Dependency
 - libcurl
 - [RapidJSON](https://github.com/Tencent/rapidjson/)
 Basic Usage
#include "docker.h"
int main(){
    Docker client = Docker();
    JSON_DOCUMENT doc = client.list_containers(true);
    std::cout << jsonToString(doc) << std::endl;
    return 0;
}
 Return Type for Each Methods
Object o; (rapidjson::Document)
 - success        [bool]                  : if succeeded to request
 - data           [Object/Array/string]   : actual data by server (data type depends on API, but it would be Object if 'success' is false)
 - code(optional) [int]                   : http status code if 'success' is false
e.g.
{
  "success": false,
  "code": 404,
  "data": {
      "message": "No such container: 5d271b3a52263330348b71948bd25cda455a49f7e7d69cfc73e6b2f3b5b41a4c"
  }
}
{
  "success": true ,
  "data": {
      "Architecture": "x86_64",
          ...
      "SystemTime": "2018-05-23T19:26:54.357768797+09:00"
  }
}
****/

#include "docker.h"
#include <utility>
#include <sstream>
#include <string>
#include <iostream>
#include <string.h>
#include <stdio.h>
#include "db.h"
#include "utils.h"
#include "logger.h"
#include <cstdlib>
#include "rapidjson/pointer.h"
#include "rapidjson/rapidjson.h"
#include <chrono>
#include <thread>
/*
*
* START Docker Implementation
*
*/
JSON_DOCUMENT Docker::emptyDoc = JSON_DOCUMENT();

Docker::Docker() : host_uri("http:/v1.24"){
    curl_global_init(CURL_GLOBAL_ALL);
    is_remote = false;
}
Docker::Docker(std::string host) : host_uri(std::move(host)){
    curl_global_init(CURL_GLOBAL_ALL);
    is_remote = true;
}

Docker::~Docker(){
    curl_global_cleanup();
}


/*
*
* Public Methods
*
*/

/*
* System
*/
JSON_DOCUMENT Docker::system_info(){
    std::string path = "/info";
    return requestAndParseJson(GET,path);
}
JSON_DOCUMENT Docker::docker_version(){
    std::string path = "/version";
    return requestAndParseJson(GET,path);
}

/*
* Images
*/
JSON_DOCUMENT Docker::list_images(){
    std::string path = "/images/json";
    return requestAndParseJson(GET,path);
}
JSON_DOCUMENT Docker::create_image(JSON_DOCUMENT& parameters, const std::string& image){
    std::string path = "/images/create?";
    path += param("fromImage", image);
    return requestAndParseJson(POST,path,201,parameters);
}
/*
* Containers
*/
JSON_DOCUMENT Docker::list_containers(bool all, int limit, const std::string& since, const std::string& before, int size, JSON_DOCUMENT& filters){
    std::string path = "/containers/json?";
    path += param("all", all);
    path += param("limit", limit);
    path += param("since", since);
    path += param("before", before);
    path += param("size", size);
    path += param("filters", filters);
    return requestAndParseJson(GET,path);
}
JSON_DOCUMENT Docker::inspect_container(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/json";
    return requestAndParseJson(GET,path);
}
JSON_DOCUMENT Docker::top_container(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/top";
    return requestAndParseJson(GET,path);
}
JSON_DOCUMENT Docker::logs_container(const std::string& container_id, bool follow, bool o_stdout, bool o_stderr, bool timestamps, const std::string& tail){
    std::string path = "/containers/" + container_id + "/logs?";
    path += param("follow", follow);
    path += param("stdout", o_stdout);
    path += param("stderr", o_stderr);
    path += param("timestamps", timestamps);
    path += param("tail", tail);
    return requestAndParse(GET,path,101);
}
JSON_DOCUMENT Docker::create_container(JSON_DOCUMENT& parameters, const std::string& name){
    std::string path = "/containers/create";
    path += not name.empty() ? "?name=" + name : "";
    return requestAndParseJson(POST,path,201,parameters);
}
JSON_DOCUMENT Docker::start_container(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/start";
    return requestAndParse(POST,path,204);
}
JSON_DOCUMENT Docker::get_container_changes(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/changes";
    return requestAndParseJson(GET,path);
}
JSON_DOCUMENT Docker::stop_container(const std::string& container_id, int delay){
    std::string path = "/containers/" + container_id + "/stop?";
    path += param("t", delay);
    return requestAndParse(POST,path,204);
}
JSON_DOCUMENT Docker::kill_container(const std::string& container_id, int signal){
    std::string path = "/containers/" + container_id + "/kill?";
    path += param("signal", signal);
    return requestAndParse(POST,path,204);
}
JSON_DOCUMENT Docker::pause_container(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/pause";
    return requestAndParse(POST,path,204);
}
JSON_DOCUMENT Docker::wait_container(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/wait";
    return requestAndParseJson(POST,path);
}
JSON_DOCUMENT Docker::delete_container(const std::string& container_id, bool v, bool force){
    std::string path = "/containers/" + container_id + "?";
    path += param("v", v);
    path += param("force", force);
    return requestAndParse(DELETE,path,204);
}
JSON_DOCUMENT Docker::unpause_container(const std::string& container_id){
    std::string path = "/containers/" + container_id + "/unpause?";
    return requestAndParse(POST,path,204);
}
JSON_DOCUMENT Docker::restart_container(const std::string& container_id, int delay){
    std::string path = "/containers/" + container_id + "/restart?";
    path += param("t", delay);
    return requestAndParse(POST,path,204);
}
JSON_DOCUMENT Docker::attach_to_container(const std::string& container_id, bool logs, bool stream, bool o_stdin, bool o_stdout, bool o_stderr){
    std::string path = "/containers/" + container_id + "/attach?";
    path += param("logs", logs);
    path += param("stream", stream);
    path += param("stdin", o_stdin);
    path += param("stdout", o_stdout);
    path += param("stderr", o_stderr);

    return requestAndParse(POST,path,101);
}
//void Docker::copy_from_container(const std::string& container_id, const std::string& file_path, const std::string& dest_tar_file){}


/*
*
* Private Methods
*
*/

JSON_DOCUMENT Docker::requestAndParse(Method method, const std::string& path, unsigned success_code, JSON_DOCUMENT& param, bool isReturnJson){
    std::string readBuffer;
    std::string paramString;
    std::string method_str;
    struct curl_slist *headers = nullptr;
    const char *paramChar;
    switch(method){
        case GET:
            method_str = "GET";
            break;
        case POST:
            method_str = "POST";
            break;
        case DELETE:
            method_str = "DELETE";
            break;
        case PUT:
            method_str = "PUT";
            break;
        default:
            method_str = "GET";
    }

    curl = curl_easy_init();
    if(!curl){
        std::cout << "error while initiating curl" << std::endl;
        curl_global_cleanup();
        exit(1);
    }
    rapidjson::StringBuffer buffer;
    buffer.Clear();
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    param.Accept(writer);
    paramString = std::string(buffer.GetString());
    paramChar = paramString.c_str();
    if(isReturnJson)
        headers = curl_slist_append(headers, "Accept: application/json");
    headers = curl_slist_append(headers, "Content-Type: application/json");

    //std::cout << "HOST_PATH : " << (host_uri + path) << std::endl;

    if(!is_remote)
        curl_easy_setopt(curl, CURLOPT_UNIX_SOCKET_PATH, "/var/run/docker.sock");
    curl_easy_setopt(curl, CURLOPT_URL, (host_uri + path).c_str());
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, method_str.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
    if(method == POST){
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, paramChar);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, strlen(paramChar));
    }

    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
        fprintf(stderr, "curl_easy_perform() failed: %s\n",
            curl_easy_strerror(res));
    unsigned status = 0;
    curl_easy_getinfo (curl, CURLINFO_RESPONSE_CODE, &status);
    curl_easy_cleanup(curl);

    const char* buf = readBuffer.c_str();
    JSON_DOCUMENT doc(rapidjson::kObjectType);
    if(status == success_code || status == 200){
        doc.AddMember("success", true, doc.GetAllocator());

        JSON_VALUE dataString;
        dataString.SetString(readBuffer.c_str(), doc.GetAllocator());

        doc.AddMember("data", dataString, doc.GetAllocator());
    }else{
        JSON_DOCUMENT resp(&doc.GetAllocator());
        resp.Parse(buf);

        doc.AddMember("success", false, doc.GetAllocator());
        doc.AddMember("code", status, doc.GetAllocator());
        doc.AddMember("data", resp, doc.GetAllocator());
    }
    curl_slist_free_all(headers);
    return doc;
}

JSON_DOCUMENT Docker::requestAndParseJson(Method method, const std::string& path, unsigned success_code, JSON_DOCUMENT& param){
    auto result_obj = requestAndParse(method,path,success_code,param,true);
    bool result = (result_obj.HasMember("success") && result_obj["success"].IsBool() && result_obj["success"].GetBool());
    if(result){
        JSON_DOCUMENT doc(rapidjson::kObjectType);

        JSON_DOCUMENT data(&doc.GetAllocator());
        data.Parse(result_obj["data"].GetString());

        doc.AddMember("success", true, doc.GetAllocator());
        doc.AddMember("data", data, doc.GetAllocator());
        return doc;
    }else{
        return result_obj;
    }
}

/*
*
* END Docker Implementation
*
*/

std::string param( const std::string& param_name, const std::string& param_value){
    if(!param_value.empty()){
        return "&" + param_name + "=" + param_value;
    }
    else{
        return "";
    }
}

std::string param( const std::string& param_name, const char* param_value){
    if(param_value != nullptr){
        return "&" + param_name + "=" + param_value;
    }
    else{
        return "";
    }
}

std::string param( const std::string& param_name, bool param_value){
    std::string ret;
    ret = "&" + param_name + "=";
    if(param_value){
        return ret + "true";
    }
    else{
        return ret + "false";
    }
}

std::string param( const std::string& param_name, int param_value){
    if(param_value != -1){
        std::ostringstream convert;
        convert << param_value;
        return "&" + param_name + "=" + convert.str();
    }
    else{
        return "";
    }
}

std::string param( const std::string& param_name, JSON_DOCUMENT& param_value){
    if(param_value.IsObject()){
        std::string paramString;
        rapidjson::StringBuffer buffer;
        buffer.Clear();
        rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
        param_value.Accept(writer);
        paramString = std::string(buffer.GetString());
        return "&" + param_name + "=" + paramString;
    }
    else{
        return "";
    }
}

std::string jsonToString(JSON_VALUE & doc){
    rapidjson::StringBuffer buffer;
    buffer.Clear();
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    doc.Accept(writer);
    return std::string(buffer.GetString());
}
int Docker::start_container_by_name(rapidjson::Document &create, const std::string& image, bool verbose, const std::string& name, bool logs, bool stream, bool o_stdin, bool o_stdout, bool o_stderr)
{
    Logger log;
    Docker client = Docker();

    JSON_DOCUMENT create_log;

    if(verbose){
         // pretty print
        rapidjson::StringBuffer buffer;
        rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
        create.Accept(writer);
        const char* charBuffer = buffer.GetString();
        printf(charBuffer);
    }


    JSON_DOCUMENT container = client.create_container(create, name);
    if(verbose)
        log.Info(jsonToString(container).c_str());

    assert(container.IsObject());
    assert(container.HasMember("success"));

    rapidjson::Value::ConstMemberIterator itr = container.FindMember("code");
    if(itr != container.MemberEnd() && container["code"].GetInt() == 409){
        // 409 image already in use
        log.Info("There is an active video stream, please stop it first!");
        log.Info(jsonToString(container["data"]).c_str());
    }

    if(itr != container.MemberEnd() && container["code"].GetInt() == 404){
        // 404 image does not exsist
        // Pull image
        log.Info("Image does not exist, first startup?, lets pull it..., this could take a few moments!");
        JSON_DOCUMENT create_image = client.create_image(create, image);
        assert(create_image.HasMember("success"));
        assert(create_image["success"].IsBool());
        rapidjson::Value::ConstMemberIterator s_itr = create_image.FindMember("success");

         if(s_itr != container.MemberEnd() && create_image["success"].IsBool() && create_image["success"] == true){
            log.Info("Done. Image pulled successfully.");
            container = client.create_container(create, name);

            if(verbose)
                log.Info(jsonToString(container).c_str());
         }


    }



    if(container["success"].GetBool() == 1){

        log.Info("container successfully created");
        JSON_DOCUMENT start = client.start_container(container["data"]["Id"].GetString());
        log.Info(jsonToString(start).c_str());

        assert(start.IsObject());
        assert(start.HasMember("success"));
        if(start["success"].GetBool() == 1){
            log.Info("container successfully started");

            //attach_to_container(const std::__cxx11::string &container_id, bool logs = false,
            // bool stream = false, bool o_stdin = false, bool o_stdout = false, bool o_stderr = false)
            create_log = client.attach_to_container(container["data"]["Id"].GetString(), logs,stream,o_stdin,o_stdout,o_stderr);

            if(verbose)
                log.Info(jsonToString(create_log).c_str());

            return 0;
        }
        return 0;
    }
    return 1;
}
JSON_DOCUMENT Docker::stop_container_by_name(bool debugger, const std::string& name)
{
    Docker client = Docker();
    Logger log;

    JSON_DOCUMENT all_ct = client.list_containers(true);
    // if(debugger)
    //     log.Info(jsonToString(all_ct).c_str());

    rapidjson::Value &v = all_ct;

    // rapidjson::Pointer namePtr("/rtsp_server");
    if (v["data"].IsArray()) {
        for (rapidjson::SizeType i = 0; i < v["data"].Size(); i++) {
            auto it = v["data"][i].FindMember("Names");
            if (it != v["data"][i].MemberEnd()){

                if(v["data"][i]["Names"][0] == "/"+name){

                    std::string msg = name + " server stopped!";
                    log.Info(msg.c_str());

                    // TODO kill or stop command?
                    JSON_DOCUMENT kill = client.kill_container(v["data"][i]["Id"].GetString());
                    bool killed = kill["success"].GetBool();
                    if(!killed){
                        JSON_DOCUMENT del = client.delete_container(v["data"][i]["Id"].GetString());
                        log.Info("delete container");
                        if(debugger)
                            log.Info(jsonToString(del).c_str());
                    }

                    return 0;
                }
            }
        }
        // std::string msg = name + " not running, nothing to stop.";
        // log.Error(msg.c_str());
        return 0;
    }

    if(debugger){
        //   pretty print
        rapidjson::StringBuffer buffer;
        rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
        all_ct.Accept(writer);
        const char* charBuffer = buffer.GetString();
        printf(charBuffer);
    }

    return 0;
}
// using namespace rapidjson;

