#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include <gst/gst.h>
#include "camera.h"
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include "includes/db.h"
#include "includes/utils.h"
#include <vector>

//https://github.com/thaytan/gst-rpicamsrc
// #include <raspicam/raspicam.h>

int Camera::video_udp(int arg, char *argv[])
{

    GstElement *pipeline, *videosrc, *converter, *enc, *pay, *udpsink, *caps_filter, *parser, *queue = nullptr;
    GstCaps *filtercaps;
    // GstPad *pad;
    GstStateChangeReturn ret;

    // init GStreamer
    gst_init(&arg, &argv);
    GMainLoop *loop = g_main_loop_new(NULL, FALSE);

    // setup pipeline
    pipeline = gst_pipeline_new("uavcast-pipeline");

    caps_filter = gst_element_factory_make("capsfilter", "caps_filter");

    queue = gst_element_factory_make("queue", "queue");

    videosrc = gst_element_factory_make("v4l2src", "source");

    converter = gst_element_factory_make("videoconvert", "converter");

    enc = gst_element_factory_make("x264enc", "enc");

    parser = gst_element_factory_make("h264parse", "parser");
    // g_object_set(G_OBJECT(enc), "tune", "zerolatency", NULL);

    pay = gst_element_factory_make("rtph264pay", "pay");
    g_object_set(G_OBJECT(pay), "config-interval", 1, NULL);

    udpsink = gst_element_factory_make("udpsink", "udp");

    if (!pipeline || !caps_filter || !videosrc || !converter || !queue || !enc || !pay || !udpsink || !parser)
    {
        g_printerr("One element could not be created. Exiting.\n");
        return -1;
    }

    /*set der source*/
    g_object_set(videosrc, "device", "/dev/video0", NULL);
    g_object_set(G_OBJECT(udpsink), "host", "10.0.0.27", NULL);
    g_object_set(G_OBJECT(udpsink), "port", 5600, NULL);

    // g_object_set(caps_filter, "caps", gst_caps_new_simple("video/x-raw", "width", G_TYPE_INT, 320, "height", G_TYPE_INT, 176, NULL), NULL);

    filtercaps = gst_caps_new_simple("video/x-raw",
                                     "format", G_TYPE_STRING, "I420",
                                     "width", G_TYPE_INT, 320,
                                     "height", G_TYPE_INT, 176,
                                     "brightness", G_TYPE_INT, 1,
                                     "framerate", GST_TYPE_FRACTION, 15, 1,
                                     //  "pixel-aspect-ratio", GST_TYPE_FRACTION, 1, 1,
                                     //  "bitrate", G_TYPE_INT, 20000000,
                                     //  "bufsize", G_TYPE_INT, 2000,
                                     NULL);

    g_object_set(caps_filter, "caps", filtercaps, NULL);
    gst_caps_unref(filtercaps);
    //Link
    gst_bin_add_many(GST_BIN(pipeline), videosrc, caps_filter, converter, enc, parser, queue, pay, udpsink, NULL);
    gst_element_link_many(videosrc, converter, caps_filter, enc, parser, queue, pay, udpsink, NULL);

    gst_element_link(videosrc, caps_filter);
    // play
    ret = gst_element_set_state(pipeline, GST_STATE_PLAYING);
    if (ret == GST_STATE_CHANGE_FAILURE)
    {
        g_printerr("Unable to set the pipeline to the playing state.\n");
        gst_object_unref(GST_OBJECT(pipeline));
        return -1;
    }

    // std::pair<std::string, std::string> test;

    /* wait until it's up and running or failed */
    if (gst_element_get_state(pipeline, NULL, NULL, -1) == GST_STATE_CHANGE_FAILURE)
    {
        g_error("Failed to go into PLAYING state");
    }
    g_print("uavcast gst running ...\n");

    g_main_loop_run(loop);
    // clean up
    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(GST_OBJECT(pipeline));
    g_main_loop_unref(loop);

    return 0;
}

int Camera::video_udp_parse_launch()
{

    Database db;
    camera_values camera;
    db.get_camera(&camera);

    EndpointRecords endpoints = db.get_endpoints();

    std::string pipeline_str;
    std::string clients;
    char delimiter = 'x';
    Utils utils;
    std::vector<std::string> res = utils.split(camera.resolution, delimiter);

    // std::cout << camera.cameraType << '\n';
    //If custom pipeline, assign pipe and jump to gst_parse_launch
    if (camera.cameraType == "custom")
    {
        pipeline_str = camera.customPipeline;
        goto generate_pipeline;
    }

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
        std::cout << "no camera clients found!.. process stopped!" << '\n';
        std::cout << "make sure you have selected a destination in Ground Controller Page!" << '\n';
        return -1;
    }

    std::cout << "format:"
              << "\n";
    std::cout << camera.format << "\n";


    // if (camera.format == "raspivid")
    // {
    //     pipeline_str =
    //         std::string("rpicamsrc preview=0 bitrate=1500000") +
    //         std::string(" ! video/x-h264, width=") + res[0] +
    //         std::string(",height=") + res[1] +
    //         std::string(",framerate=30/1,profile=high") +
    //         std::string(" ! h264parse ! rtph264pay ! ");
    // }

    if (camera.format == "video/x-raw")
    {
        pipeline_str =
            std::string("v4l2src device=") + camera.cameraType +
            std::string(" ! rotate angle=") + std::to_string(camera.rotation * 0.01745329252) +  // convert to radians. 1deg = 0.01745329252 rad
            std::string(" ! videobalance contrast=") + std::to_string(camera.contrast) +
            std::string(" brightness=") + std::to_string(camera.brightness) +
            std::string(" ! videoflip method=") + camera.flipCamera +
            std::string(" ! video/x-raw,width=") + res[0] +
            std::string(",height=") + res[1] +
            std::string(" ! videoflip video-direction=identity") +
            std::string(" ! videoconvert ! video/x-raw,format=I420") +
            std::string(" ! queue max-size-buffers=1 name=q_enc ! x264enc") +
            std::string(" tune=zerolatency bitrate=2000 speed-preset=superfast") +
            std::string(" ! rtph264pay name=pay0 pt=96 ! ");
    }

    if (camera.format == "video/x-h264")
    {
        pipeline_str =
            std::string("v4l2src device=") + camera.cameraType +
            std::string(" ! rotate angle=") + std::to_string(camera.rotation * 0.01745329252) +  // convert to radians. 1deg = 0.01745329252 rad
            std::string(" ! videobalance contrast=") + std::to_string(camera.contrast) +
            std::string(" brightness=") + std::to_string(camera.brightness) +
            std::string(" ! videoflip method=") + camera.flipCamera +
            std::string(" ! video/x-h264,width=") + res[0] +
            std::string(",height=") + res[1] +
            std::string(" ! videoflip video-direction=identity") +
            std::string(" ! videoconvert ! video/x-h264,format=I420") +
            std::string(" ! queue max-size-buffers=1 name=q_enc ! x264enc") +
            std::string(" tune=zerolatency bitrate=2000 speed-preset=superfast") +
            std::string(" ! h264parse ! rtph264pay name=pay0 pt=96 ! ");
    }
    std::cout << pipeline_str << "\n";
    //check if tcp or udp
    if (camera.protocol == "tcp")
    {
        pipeline_str += std::string("gdppay ! tcpserversink host=") + "localhost" + " port=5600";
    }
    else
    {
        pipeline_str += std::string("multiudpsink clients=") + clients;
    }

generate_pipeline:
    std::cout << "protocol " + camera.protocol << '\n';
    std::cout << "playing pipeline " + camera.format << '\n';
    std::cout << pipeline_str << '\n';
    // std::cout << pipeline_str << "\n";
    GstElement *pipeline = nullptr;
    GstStateChangeReturn ret;

    // init GStreamer
    gst_init(0, 0);
    GMainLoop *loop = g_main_loop_new(NULL, FALSE);
    pipeline = gst_parse_launch(pipeline_str.c_str(), NULL);

    // play
    ret = gst_element_set_state(pipeline, GST_STATE_PLAYING);
    if (ret == GST_STATE_CHANGE_FAILURE)
    {
        g_printerr("Unable to set the pipeline to the playing state.\n");
        gst_object_unref(GST_OBJECT(pipeline));
        return -1;
    }

    /* wait until it's up and running or failed */
    if (gst_element_get_state(pipeline, NULL, NULL, -1) == GST_STATE_CHANGE_FAILURE)
    {
        g_error("Failed to go into PLAYING state");
    }
    g_print("uavcast pipeline is PLAYING ...\n");

    g_main_loop_run(loop);
    // clean up
    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(GST_OBJECT(pipeline));
    g_main_loop_unref(loop);

    return 0;
}

int Camera::webcam_get_webcam_device_data()
{

    GstDeviceMonitor *monitor;
    // GstBus *bus;
    GstCaps *caps;

    monitor = gst_device_monitor_new();
    // bus = gst_device_monitor_get_bus(monitor);

    caps = gst_caps_new_empty_simple("video/x-raw");
    gst_device_monitor_add_filter(monitor, "Video/Source", caps);
    // gst_caps_unref(caps);

    gst_device_monitor_start(monitor);

    std::cout << GST_MESSAGE_TYPE(monitor) << '\n';
    // {
    //     pipeline_desc = g_strdup_printf("%s name=source device=%s ! fakesink",
    //                                     webcam_device,
    //                                     webcam_device->video_device);
    //     err = NULL;
    //     pipeline = gst_parse_launch(pipeline_desc, &err);
    //     if ((pipeline != NULL) && (err == NULL))
    //     {
    //         /* Start the pipeline and wait for max. 10 seconds for it to start up */
    //         gst_element_set_state(pipeline, GST_STATE_PLAYING);
    //         ret = gst_element_get_state(pipeline, NULL, NULL, 10 * GST_SECOND);

    //         /* Check if any error messages were posted on the bus */
    //         bus = gst_element_get_bus(pipeline);
    //         msg = gst_bus_poll(bus, GST_MESSAGE_ERROR, 0);
    //         gst_object_unref(bus);

    //         if ((msg == NULL) && (ret == GST_STATE_CHANGE_SUCCESS))
    //         {
    //             GstElement *src;
    //             GstPad *pad;
    //             char *name;
    //             GstCaps *caps;

    //             gst_element_set_state(pipeline, GST_STATE_PAUSED);

    //             src = gst_bin_get_by_name(GST_BIN(pipeline), "source");

    //             g_object_get(G_OBJECT(src), "device-name", &name, NULL);
    //             if (name == NULL)
    //                 name = "Unknown";

    //             g_print("Device: %s (%s)\n", name, webcam_device->video_device);
    //             pad = gst_element_get_pad(src, "src");
    //             caps = gst_pad_get_caps(pad);
    //             gst_object_unref(pad);
    //             cheese_webcam_get_supported_video_formats(webcam_device, caps);
    //             gst_caps_unref(caps);
    //         }
    //         gst_element_set_state(pipeline, GST_STATE_NULL);
    //         gst_object_unref(pipeline);
    //     }
    //     if (err)
    //         g_error_free(err);

    //     g_free(pipeline_desc);
    // }
    return 0;
}

int main(int argc, char *argv[])
{
    Camera camera;
    Utils utils;
    if (argc == 1)
    {
        std::cout << "camera application for uavcast. Type -h or --help to learn more\n";
    }

    for (int i = 0; i < argc; i++)
    {
        if (std::string(argv[i]) == "-h" || std::string(argv[i]) == "--help")
        {
            std::cout << "Option -start to start video\n";
            std::cout << "Option -stop to stop all services\n\n\n";
            std::cout << "author: Bernt Christian Egeland / uavmatrix.com\n\n";
        }

        if (std::string(argv[i]) == "-start" || std::string(argv[i]) == "--start")
        {
            camera.video_udp_parse_launch();
        }
        if (std::string(argv[i]) == "-stop" || std::string(argv[i]) == "--stop")
        {

            // Check if video is running
            std::string camera_enabled = utils.exec("sudo systemctl is-active uavcast-camera");
            if (utils.isWordPresent(camera_enabled, "active"))
            {
                std::cout << "Could not stop camera proccess!!\n";
            }
            else
            {
                std::cout << "Camera has been stopped!\n";
            }

            return 0;
        }
    }
}