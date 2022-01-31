#include <utility>
#include <sstream>
#include <string>
#include <iostream>
#include <string.h>
#include <stdio.h>
#include "db.h"
#include "utils.h"
#include <cstdlib>
#include "docker.h"
#include "logger.h"
#include "camera.h"
#include <assert.h>
#include "rapidjson/pointer.h"
#include "rapidjson/rapidjson.h"

int Camera::rtsp_docker_start()
{
    Logger log;
    Docker client = Docker();
    Database db;
    camera_values camera_val;
    db.get_camera(&camera_val);

    rapidjson::Document document;
    JSON_DOCUMENT logs;
    document.SetObject();

    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

    std::string str_res = camera_val.resolution + "x" + std::to_string(camera_val.framesPrSecond);
    char char_res[str_res.length()+1];
    strcpy(char_res, str_res.c_str());

    rapidjson::Value resolution;
    resolution.SetString(char_res, str_res.length()); // ok

    rapidjson::Value cmd(rapidjson::kArrayType);

    cmd.PushBack("-u", allocator);
    cmd.PushBack("uavcast" , allocator);
    cmd.PushBack("-G" , allocator);
    cmd.PushBack(resolution, allocator);

    // create main object docker config
    // TODO add container Image tag in db
    document.AddMember("Image", "mpromonet/v4l2rtspserver:v0.2.4", allocator);
    document.AddMember("Name", "rtsp_server", allocator);
    document.AddMember("AttachStdin", true, allocator);
    document.AddMember("AttachStdout", true, allocator);
    document.AddMember("AttachStderr", true, allocator);
    document.AddMember("Cmd", cmd, allocator);

    // create hostconfig object
    rapidjson::Value hostConfig(rapidjson::kObjectType);
    hostConfig.AddMember("Privileged", true , allocator);
    hostConfig.AddMember("AutoRemove", true , allocator);
    hostConfig.AddMember("NetworkMode", "host" , allocator);

    // add hostconfig to doc
    document.AddMember("HostConfig", hostConfig, allocator);

    // pretty print
    rapidjson::StringBuffer buffer;
    rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
    document.Accept(writer);
    // const char* charBuffer = buffer.GetString();
    // printf(charBuffer);

    JSON_DOCUMENT create = client.create_container(document, std::string("rtsp_server"));

    assert(create.IsObject());
    assert(create.HasMember("success"));

    if(create["success"].GetBool() == 1){

        log.Info("container successfully created");
        JSON_DOCUMENT start = client.start_container(create["data"]["Id"].GetString());

        assert(start.IsObject());
        assert(start.HasMember("success"));
        if(start["success"].GetBool() == 1){
            log.Info("container successfully started");
            //attach_to_container(const std::__cxx11::string &container_id, bool logs = false,
            // bool stream = false, bool o_stdin = false, bool o_stdout = false, bool o_stderr = false)
            logs = client.attach_to_container(create["data"]["Id"].GetString(), false,false,false,false,false);
            log.Info(jsonToString(logs).c_str());
            return 0;
        }
        log.Info(jsonToString(start).c_str());

    }

    return 0;
}
void find(rapidjson::Value &v, const char* name) {
    Logger log;
    auto it = v.FindMember(name);
    if (it != v.MemberEnd())
        log.Info("Found");
    else
        log.Info("Not found");
}

int Camera::rtsp_docker_stop()
{
    Docker client = Docker();
    Logger log;

    // rapidjson::Document document;
    // document.SetObject();

    JSON_DOCUMENT all_ct = client.list_containers(true);
    rapidjson::Value &v = all_ct;

    // rapidjson::Pointer namePtr("/rtsp_server");
    if (v["data"].IsArray()) {
        for (rapidjson::SizeType i = 0; i < v["data"].Size(); i++) {
            // std::cout << jsonToString(v["data"][0]["Names"]) << std::endl;

            auto it = v["data"][i].FindMember("Names");
            if (it != v["data"][i].MemberEnd()){

                if(v["data"][i]["Names"][0] == "/rtsp_server"){

                    log.Info("rtsp server running, stopping...");
                    // std::cout << jsonToString(v["data"][i]["Id"]) << std::endl;

                    // TODO kill or stop command?
                    client.kill_container(v["data"][i]["Id"].GetString());
                    return 0;
                    // client.stop_container(v["data"][i]["Id"].GetString());
                }

            }
        }

         std::cout << "No streaming active!" << std::endl;
         return 0;
    }

  // pretty print
    rapidjson::StringBuffer buffer;
    rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
    all_ct.Accept(writer);

    // const char* charBuffer = buffer.GetString();
    // printf(charBuffer);
    return 0;
}
int Camera::initialize()
{
    Logger log;
    Camera camera;
    Database db;
    camera_values camera_val;
    db.get_camera(&camera_val);

    if(!camera_val.enableCamera) {
        log.Info("Camera not enabled, exiting!");
        return 1;
    }

    if(camera_val.protocol == "rtsp") {
        log.Info("rtsp selected");
        camera.rtsp_docker_start();
    }
    return 0;
}
int Camera::teardown()
{
    Camera camera;
    camera.rtsp_docker_stop();
    return 0;
}
// int main(int argc, char *argv[])
// {
//     Logger log;
//     // Utils utils;
//     Camera camera;
//     Database db;
//     camera_values camera_val;
//     db.get_camera(&camera_val);

//     if (argc == 1)
//     {
//         std::cout << "camera application for uavcast. Type -h or --help to learn more\n";
//     }

//     for (int i = 0; i < argc; i++)
//     {
//         if (std::string(argv[i]) == "-h" || std::string(argv[i]) == "--help")
//         {
//             std::cout << "Option -start to start video\n";
//             std::cout << "Option -stop to stop all services\n\n\n";
//             std::cout << "author: Bernt Christian Egeland / aka sinamics\n\n";
//         }

//         if (std::string(argv[i]) == "-start" || std::string(argv[i]) == "--start")
//         {
//             camera.initialize();
//         }
//         if (std::string(argv[i]) == "-stop" || std::string(argv[i]) == "--stop")
//         {
//             camera.teardown();
//         }
//     }

// }
