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
#include <math.h>



int Camera::rtsp_docker_start()
{
    // https://github.com/mpromonet/v4l2rtspserver
    const std::string container_image = "mpromonet/v4l2rtspserver:v0.2.4";
    const std::string container_name = "rtsp_server";

    Logger log;
    Utils utils;
    Docker client = Docker();
    Database db;
    db_camera db_camera_obj;
    db.get_camera(&db_camera_obj);

    db_logger db_logger_obj;
    db.get_logger(&db_logger_obj);

    rapidjson::Document document;
    JSON_DOCUMENT logs;
    document.SetObject();

    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

    std::string str_res = db_camera_obj.resolution + "x" + std::to_string(db_camera_obj.framesPrSecond);
    char char_res[str_res.length()+1];
    strcpy(char_res, str_res.c_str());

    rapidjson::Value resolution;
    resolution.SetString(char_res, str_res.length());

    rapidjson::Value cmd(rapidjson::kArrayType);

    cmd.PushBack("-u", allocator);
    cmd.PushBack("uavcast" , allocator);
    cmd.PushBack("-G" , allocator);
    cmd.PushBack(resolution, allocator);

    // create main object docker config
    document.AddMember("Image", container_image, allocator);
    document.AddMember("Name", container_name, allocator);
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

    if(client.start_container_by_name(document,container_image, db_logger_obj.debug, container_name) == 0)
    {
        std::vector<std::string> ip_lists;
        log.Info("get stream by using the following rtsp url:\n");
        ip_lists = utils.local_ip();

        if(ip_lists.size() == 0)
            return 0;

        for (auto &ip_list : ip_lists)
        {
            printf("rtsp://%s%s", ip_list.c_str(), ":8554/uavcast\n");
        }
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

int Camera::gst_docker_start()
{
    // enable to see more verbose output from docker
    bool container_logs = true;
    bool container_stream = false;
    bool container_o_stdin = false;
    bool container_o_stdout = true;
    bool container_o_stderr = true;

    const std::string container_image = "sinamics/gstreamer:latest";
    const std::string container_name = "gst_server";

    Logger log;
    Utils utils;
    Docker client = Docker();
    Database db;
    db_logger db_logger_obj;
    db.get_logger(&db_logger_obj);

    db_camera db_camera_obj;
    db.get_camera(&db_camera_obj);

    rapidjson::Document document;
    JSON_DOCUMENT logs;
    document.SetObject();

    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

    rapidjson::Value cmd(rapidjson::kArrayType);

    // TODO
    std::string pipeline_str;

    EndpointRecords endpoints = db.get_endpoints();
    std::string clients;
    // map clients
    for (auto i = 0u; i < endpoints.size(); i++)
    {
        if (endpoints[i].videoEnable == 0)
            continue;

        clients += endpoints[i].endpointIPaddress + ":" + std::to_string(endpoints[i].videoPort);

        if (i < endpoints.size() - 1)
        {
            clients += ",";
        }
    }

    char delimiter = 'x';
    std::vector<std::string> res_arr = utils.split(db_camera_obj.resolution, delimiter);

    char res_width[res_arr[0].length()];
    strcpy(res_width, res_arr[0].c_str());

    char res_height[res_arr[1].length()];
    strcpy(res_height, res_arr[1].c_str());

    if (db_camera_obj.path == "custom_pipeline")
    {
        char *ctm_ptr;
        char ctm_pipe[db_camera_obj.customPipeline.length() + 1];
        strcpy(ctm_pipe, db_camera_obj.customPipeline.c_str());
        ctm_ptr = std::strtok(ctm_pipe, " ");

        while (ctm_ptr != NULL)
        {
            cmd.PushBack(rapidjson::Value(ctm_ptr, document.GetAllocator()).Move(), allocator);
            ctm_ptr = strtok (NULL, " ");
        }
        goto docker_config;
    }


    if (clients.empty())
    {
        log.Error("no camera clients found!.. process stopped!");
        log.Error("make sure you have selected a destination in Ground Controller Page!");
        return -1;
    }

    cmd.PushBack("v4l2src", allocator);
    cmd.PushBack(rapidjson::Value("device=" + db_camera_obj.path, document.GetAllocator()).Move(), allocator);
    // cmd.PushBack("!", allocator);
    // cmd.PushBack("rotate", allocator);
    // cmd.PushBack(rapidjson::Value("angle=" + std::to_string(db_camera_obj.rotation * M_PI / 180 ), document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("videobalance", allocator);
    cmd.PushBack(rapidjson::Value("contrast=" + std::to_string(db_camera_obj.contrast), document.GetAllocator()).Move(), allocator);
    cmd.PushBack(rapidjson::Value("brightness=" + std::to_string(db_camera_obj.brightness), document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("videoflip", allocator);
    cmd.PushBack(rapidjson::Value("method=" + db_camera_obj.flipCamera, document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack(rapidjson::Value("video/x-raw,framerate=" + std::to_string(db_camera_obj.framesPrSecond) + "/1,width=" + res_arr[0] + ",height=" + res_arr[1], document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("videoflip", allocator);
    cmd.PushBack("video-direction=identity", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("videoconvert", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("video/x-raw,format=I420", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("queue", allocator);
    cmd.PushBack("max-size-buffers=1", allocator);
    cmd.PushBack("name=q_enc", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("x264enc", allocator);
    cmd.PushBack("tune=zerolatency", allocator);
    // cmd.PushBack(rapidjson::Value("bitrate=" + std::to_string(db_camera_obj.bitratePrSecond / 1000), document.GetAllocator()).Move(), allocator);
    cmd.PushBack("speed-preset=superfast", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("rtph264pay", allocator);
    cmd.PushBack("name=pay0", allocator);
    cmd.PushBack("pt=96", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("multiudpsink", allocator);
    cmd.PushBack(rapidjson::Value("clients=" + clients, document.GetAllocator()).Move(), allocator);

    // log.Info(jsonToString(cmd).c_str());


    // jump point
    docker_config:

    // create main object docker config
    // TODO add container Image tag in db
    document.AddMember("Image", container_image, allocator);
    document.AddMember("Name", container_name, allocator);
    document.AddMember("AttachStdin", true, allocator);
    document.AddMember("AttachStdout", true, allocator);
    document.AddMember("AttachStderr", true, allocator);
    document.AddMember("OpenStdin", false, allocator);
    document.AddMember("StdinOnce", false, allocator);
    document.AddMember("Tty", false, allocator);
    document.AddMember("Cmd", cmd, allocator);

    // create hostconfig object
    rapidjson::Value hostConfig(rapidjson::kObjectType);
    hostConfig.AddMember("Privileged", true , allocator);
    hostConfig.AddMember("AutoRemove", true , allocator);
    hostConfig.AddMember("NetworkMode", "host" , allocator);

    // add hostconfig to doc
    document.AddMember("HostConfig", hostConfig, allocator);

    client.start_container_by_name(document, container_image, db_logger_obj.debug, container_name, container_logs, container_stream,container_o_stdin, container_o_stdout, container_o_stderr);

    return 0;
}

int Camera::initialize()
{
    Logger log;
    Camera camera;
    Database db;
    db_camera db_camera_obj;
    db.get_camera(&db_camera_obj);

    if(!db_camera_obj.enableCamera) {
        log.Info("Camera not enabled, exiting!");
        return 1;
    }
    if(db_camera_obj.path == "custom_pipeline") {
        log.Info("custom_pipeline, loading pipeline");
        return camera.gst_docker_start();
    }
    if(db_camera_obj.protocol == "rtsp") {
        log.Info("rtsp, starting v4l2rtspserver");
        return camera.rtsp_docker_start();
    }
    if(db_camera_obj.protocol == "udp") {
        log.Info("udp, starting gstreamer");
        return camera.gst_docker_start();
    }
    return 0;
}
int Camera::teardown()
{
    Docker client = Docker();
    Logger log;
    Database db;
    db_logger db_logger_obj;
    db.get_logger(&db_logger_obj);

    JSON_DOCUMENT all_ct = client.list_containers(true);
    rapidjson::Value &v = all_ct;
        if (v["data"].IsArray()) {
        for (rapidjson::SizeType i = 0; i < v["data"].Size(); i++) {
            auto it = v["data"][i].FindMember("Names");
            if (it != v["data"][i].MemberEnd()){

                const std::string gstname = "gst_server";
                const std::string rtspname = "rtsp_server";

                if(v["data"][i]["Names"][0] == "/gst_server"){
                    std::string msg = gstname +" running, sending stop signal...";
                    log.Info(msg.c_str());

                    client.stop_container_by_name(db_logger_obj.debug, gstname);
                    return 0;
                }
                 if(v["data"][i]["Names"][0] == "/rtsp_server"){

                    std::string msg = rtspname +" running, sending stop signal...";
                    log.Info(msg.c_str());

                    client.stop_container_by_name(db_logger_obj.debug, rtspname);
                    return 0;
                }
            }
        }
        std::string msg = "Video server not running, nothing to stop.";
        log.Error(msg.c_str());
        return 0;
    }
    return 0;
}