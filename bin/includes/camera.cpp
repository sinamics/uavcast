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
    const std::string container_image = "mpromonet/v4l2rtspserver:v0.2.4";
    const std::string container_name = "rtsp_server";
    bool debugger = false;

    Logger log;
    Utils utils;
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

    if(client.start_container_by_name(document, debugger, container_name) == 0)
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
    const std::string container_image = "sinamics/gstreamer:latest";
    const std::string container_name = "gst_server";

    Logger log;
    Utils utils;
    Docker client = Docker();
    Database db;
    camera_values camera_val;
    db.get_camera(&camera_val);

    rapidjson::Document document;
    JSON_DOCUMENT logs;
    document.SetObject();

    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

    rapidjson::Value cmd(rapidjson::kArrayType);

    std::string pipeline_str;
    if (camera_val.cameraType == "custom")
    {
        pipeline_str = camera_val.customPipeline;
    }

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

    if (clients.empty())
    {
        log.Error("no camera clients found!.. process stopped!");
        log.Error("make sure you have selected a destination in Ground Controller Page!");
        return -1;
    }

    char delimiter = 'x';
    std::vector<std::string> res_arr = utils.split(camera_val.resolution, delimiter);

    char res_width[res_arr[0].length()];
    strcpy(res_width, res_arr[0].c_str());


    char res_height[res_arr[1].length()];
    strcpy(res_height, res_arr[1].c_str());

    cmd.PushBack("v4l2src", allocator);
    cmd.PushBack(rapidjson::Value("device=" + camera_val.cameraType, document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("rotate", allocator);
    cmd.PushBack(rapidjson::Value("angle=" + std::to_string(camera_val.rotation * 0.01745329252), document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("videobalance", allocator);
    cmd.PushBack(rapidjson::Value("contrast=" + std::to_string(camera_val.contrast), document.GetAllocator()).Move(), allocator);
    cmd.PushBack(rapidjson::Value("brightness=" + std::to_string(camera_val.brightness), document.GetAllocator()).Move(), allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack(rapidjson::Value("video/x-raw,framerate=30/1,width=" + res_arr[0] + ",height=" + res_arr[1], document.GetAllocator()).Move(), allocator);
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
    cmd.PushBack(rapidjson::Value("bitrate=" + std::to_string(camera_val.bitratePrSecond / 1000), document.GetAllocator()).Move(), allocator);
    cmd.PushBack("speed-preset=superfast", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("rtph264pay", allocator);
    cmd.PushBack("name=pay0", allocator);
    cmd.PushBack("pt=96", allocator);
    cmd.PushBack("!", allocator);
    cmd.PushBack("multiudpsink", allocator);
    cmd.PushBack(rapidjson::Value("clients=" + clients, document.GetAllocator()).Move(), allocator);


    // cmd.PushBack("videotestsrc", allocator);
    // cmd.PushBack("!", allocator);
    // cmd.PushBack("x264enc", allocator);
    // cmd.PushBack("!", allocator);
    // cmd.PushBack("video/x-h264,", allocator);
    // cmd.PushBack("stream-format=byte-stream", allocator);
    // cmd.PushBack("!", allocator);
    // cmd.PushBack("rtph264pay", allocator);
    // cmd.PushBack("!", allocator);
    // cmd.PushBack("udpsink", allocator);
    // cmd.PushBack("host=10.0.0.49", allocator);
    // cmd.PushBack("port=5600", allocator);

    // create main object docker config
    // TODO add container Image tag in db
    document.AddMember("Image", container_image, allocator);
    document.AddMember("Name", container_name, allocator);
    document.AddMember("AttachStdin", false, allocator);
    document.AddMember("AttachStdout", true, allocator);
    document.AddMember("AttachStderr", true, allocator);
    document.AddMember("OpenStdin", false, allocator);
    document.AddMember("StdinOnce", false, allocator);
    document.AddMember("Tty", true, allocator);
    document.AddMember("Cmd", cmd, allocator);

    // create hostconfig object
    rapidjson::Value hostConfig(rapidjson::kObjectType);
    hostConfig.AddMember("Privileged", true , allocator);
    hostConfig.AddMember("AutoRemove", true , allocator);
    hostConfig.AddMember("NetworkMode", "host" , allocator);

    // add hostconfig to doc
    document.AddMember("HostConfig", hostConfig, allocator);

    bool container_logs = true;
    bool container_stream = true;
    bool container_o_stdin = false;
    bool container_o_stdout = true;
    bool container_o_stderr = true;
    bool debugger = false;

    client.start_container_by_name(document, debugger, container_name, container_logs, container_stream,container_o_stdin, container_o_stdout, container_o_stderr);

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
    if(camera_val.protocol == "udp") {
        log.Info("rtsp selected");
        camera.gst_docker_start();
    }
    return 0;
}
int Camera::teardown()
{
    bool debugger = true;
    Docker client = Docker();

    // TODO store running ct in db and stop the correct one. stopping all for now.
    const std::string gstname = "gst_server";
    client.stop_container_by_name(debugger, gstname);

    const std::string rtspname = "rtsp_server";
    client.stop_container_by_name(debugger, rtspname);
    return 0;
}