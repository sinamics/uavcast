#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include <gst/gst.h>
#include "gst.h"
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include "db.h"
#include "utils.h"

//https://github.com/thaytan/gst-rpicamsrc
// #include <raspicam/raspicam.h>
int ntotal = 0;


int Gst::video_udp(int arg, char *argv[])
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
    // g_object_set(videosrc, "device", "/dev/video0", NULL);
    // g_object_set(G_OBJECT(udpsink), "host", "10.0.0.49", NULL);
    // g_object_set(G_OBJECT(udpsink), "port", 5600, NULL);

    // g_object_set(caps_filter, "caps", gst_caps_new_simple("video/x-raw", "width", G_TYPE_INT, 320, "height", G_TYPE_INT, 176, NULL), NULL);

    filtercaps = gst_caps_new_simple("video/x-raw",
                                     "format", G_TYPE_STRING, "I420",
                                     "width", G_TYPE_INT, 1640,
                                     "height", G_TYPE_INT, 922,
                                     "brightness", G_TYPE_INT, 1,
                                     "framerate", GST_TYPE_FRACTION, 30, 1,
                                     //  "pixel-aspect-ratio", GST_TYPE_FRACTION, 1, 1,
                                     //  "bitrate", G_TYPE_INT, 20000000,
                                     //  "bufsize", G_TYPE_INT, 2000,
                                     NULL);

    g_object_set(caps_filter, "caps", filtercaps, NULL);
    gst_caps_unref(filtercaps);
    //Link
    gst_bin_add_many(GST_BIN(pipeline), videosrc, caps_filter, converter, enc, queue, pay, udpsink, NULL);
    gst_element_link_many(videosrc, converter, caps_filter, enc, queue, pay, udpsink, NULL);

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

int Gst::video_udp_parse_launch()
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
static gboolean my_bus_func (GstBus * bus, GstMessage * message, gpointer user_data)
   {
      GstDevice *device;
      gchar *name;

      switch (GST_MESSAGE_TYPE (message)) {
        case GST_MESSAGE_DEVICE_ADDED:
          gst_message_parse_device_added (message, &device);
          name = gst_device_get_display_name (device);
          g_print("Device added: %s\n", name);
          g_free (name);
          gst_object_unref (device);
          break;
        case GST_MESSAGE_DEVICE_REMOVED:
          gst_message_parse_device_removed (message, &device);
          name = gst_device_get_display_name (device);
          g_print("Device removed: %s\n", name);
          g_free (name);
          gst_object_unref (device);
          break;
        default:
          break;
      }

      return G_SOURCE_CONTINUE;
   }

static void ProbeGstDevice(GstDevice* device, int inputIndex, const char* srcname,
                                int classIndex, const char* className, const char* devHandlePropName, unsigned int flags)
{
    GValue              val = G_VALUE_INIT;
    GParamSpec          *paramSpec;
    GstElement          *videosource;
    char                port_str[64];
    gchar               *pstring = NULL;
    gchar               *devString = NULL;
    long long            deviceURI = 0;

    (void) flags;
    // int ntotal = 0;
    // VideosourceRecordType *devices;

    // devString = gst_device_get_device_class(device);
    // printf("PTB-DEBUG: Device class: %s\n", (char*) devString);
    // g_free(devString);

    // devString = gst_device_get_display_name(device);
    // printf("PTB-DEBUG: Device display name: %s\n", (char*) devString);
    // g_free(devString);


    // Get dedicated instance of the video plugin, configured to use the
    // specific capture device being probed here:
    videosource = gst_device_create_element(device, "ptb_deviceprovidervideosource");
    if (videosource == NULL) {
        printf("PTB-ERROR: PsychGSProbeGstDevice(): Could not create videosource for probe target device!!!\n");
        return;
    }

    // Store the GstDevice* device as unique and well defined handle for this capture device:
    // for (auto & element : devices) {
    // // element.doSomething ();
    //  std::cout << "devices.size()" << "\n";
    // }

    // devices[ntotal].gstdevice = device;
    // std::cout << device << "\n";
    // ntotal++;
    // for (auto i = 0u; i < devices.size() i++)
    //     std::cout << devices << "\n";
    // }
    // Assign port_str equivalent to the value which would have been retrieved
    // from the probed device property of our original property-proble implementation
    // from the GStreamer-0.10.x backend. This for backwards compatibility.
    //
    // Check if our key property exists in the selected videosource and provide a type spec for it:
    if ((paramSpec = g_object_class_find_property(G_OBJECT_GET_CLASS(videosource), devHandlePropName))) {
        // Yes. Init a GValue object for the property of given type ...
        g_value_init(&val, G_PARAM_SPEC_VALUE_TYPE(paramSpec));
        // ... and then query the property and assign it to GValue 'val':
        g_object_get_property(G_OBJECT(videosource), devHandlePropName, &val);

        // String value property?
        if (G_VALUE_HOLDS_STRING(&val)) {
            // Assign as port_str:
            sprintf(port_str, "%s", (const char*) g_value_get_string(&val));
        }

        // Numeric GUID property?
        if (G_VALUE_HOLDS_UINT64(&val)) {
            // Assign as numeric string and as numeric deviceURI:
            deviceURI = g_value_get_uint64(&val);
            sprintf(port_str, "%llu", deviceURI);
        }

        // Done with val:
        g_value_unset(&val);
    }
    else {
        devString = gst_device_get_display_name(device);
        sprintf(port_str, "%s", devString);
        g_free(devString);
    }

    // devices[ntotal].deviceIndex = classIndex * 10000 + inputIndex;
    // devices[ntotal].classIndex = classIndex;
    // devices[ntotal].inputIndex = inputIndex;
    // sprintf(devices[ntotal].deviceClassName, "%s", className);
    // sprintf(devices[ntotal].deviceHandle, "%s", port_str);
    // sprintf(devices[ntotal].deviceSelectorProperty, "%s", devHandlePropName);
    // sprintf(devices[ntotal].deviceVideoPlugin, "%s", srcname);

    // Query and assign device specific parameters:
    // pstring = NULL;
    // if (g_object_class_find_property(G_OBJECT_GET_CLASS(videosource), "device")) {
    //     g_object_get(G_OBJECT(videosource), "device", &pstring, NULL);
    // }

    // if (pstring) {
    //     sprintf(devices[ntotal].device, "%s", pstring);
    //     g_free(pstring);
    // }
    // else {
    //     sprintf(devices[ntotal].device, "%s", port_str);
    // }

    pstring = NULL;
    if (g_object_class_find_property(G_OBJECT_GET_CLASS(videosource), "device-path")) {
        g_object_get(G_OBJECT(videosource), "device-path", &pstring, NULL);
        std::cout << pstring << "\n";
    }


    // if (pstring) {
    //     sprintf(devices[ntotal].devicePath, "%s", pstring);
    //     g_free(pstring);
    // }
    // else {
    //     sprintf(devices[ntotal].devicePath, "%s", port_str);
    // }

    pstring = NULL;
    if (g_object_class_find_property(G_OBJECT_GET_CLASS(videosource), "device-name")) {
        g_object_get(G_OBJECT(videosource), "device-name", &pstring, NULL);
        std::cout << pstring << "\n";
    }
    // if (pstring) {
    //     sprintf(devices[ntotal].deviceName, "%s", pstring);
    //     g_free(pstring);
    // }
    // else {
    //     sprintf(devices[ntotal].deviceName, "%s", port_str);
    // }

    // pstring = NULL;
    // if (g_object_class_find_property(G_OBJECT_GET_CLASS(videosource), "guid")) {
    //     g_object_get(G_OBJECT(videosource), "guid", &deviceURI, NULL);
    //     devices[ntotal].deviceURI = deviceURI;
    // } else {
    //     devices[ntotal].deviceURI = 0;
    // }

    // Done with our own dedicated device instance:
    gst_object_unref(GST_OBJECT(videosource));

    return;
}
int Gst::webcam_get_webcam_device_data()
{
    // gst_init (&argc, &argv);
    // GstDeviceMonitor *monitor;
    // GstBus *bus;
    // GstCaps *caps;
    // gboolean show_all;

    // show_all = true;
    // monitor = gst_device_monitor_new();

    // bus = gst_device_monitor_get_bus (monitor);
    // gst_bus_add_watch (bus, my_bus_func, NULL);
    // gst_object_unref (bus);

    // caps = gst_caps_new_empty_simple ("video/x-raw");
    // gst_device_monitor_add_filter (monitor, "Video/Source", caps);
    // gst_caps_unref (caps);

    // if(!gst_device_monitor_start(monitor)){
    //     printf("WARNING: Monitor couldn't started!!\n");
    // }

    // gst_device_monitor_set_show_all_devices(monitor, show_all);
    // GList* devices = gst_device_monitor_get_devices(monitor);
    // // std::cout << devices << "\n";

    // for (devices = g_list_first(devices); devices != NULL; devices = g_list_next(devices))
    // {
    //     std::cout << "has data" << "\n";
    // }

    // g_list_free(devices);
    // gst_device_monitor_stop(monitor);
    // // GMainLoop *loop = g_main_loop_new (NULL, FALSE);
	// // g_main_loop_run (loop);
    // // return monitor;
    // return 0;



    GstDeviceMonitor *Monitor;
    GstCaps *caps;
    GstBus *bus;
    GstDevice *device;
    GList *devlist = NULL, *devIter;
    // gchar *devString, *nameString;
    // GstStructure *properties;
    int n = 1; // Start input index is 1 for class 0.

    Monitor = gst_device_monitor_new ();
    caps = gst_caps_new_empty_simple("video/x-raw");
    // GstQuery *query = gst_query_new_allocation (caps, FALSE);


    gst_device_monitor_add_filter(Monitor, "Video/Source", NULL);
    gst_caps_unref(caps);


    bus = gst_device_monitor_get_bus (Monitor);
    gst_bus_add_watch (bus, my_bus_func, NULL);
    gst_object_unref (bus);

    if (!gst_device_monitor_start(Monitor))
    {
        printf("\n PTB-INFO: GstDeviceMonitor unsupported. May not be able to enumerate all video devices.\n");
    }
    else
    {
        devlist = gst_device_monitor_get_devices(Monitor);

        for (devIter = g_list_first(devlist); devIter != NULL; devIter = g_list_next(devIter))
        {

            device = (GstDevice*) devIter->data;
            if (device == NULL) continue;

            // Skip certain devices with certain names:
            // nameString = gst_device_get_display_name(device);
            // if (device == NULL)
            //         continue;

            // properties *= gst_device_get_properties(device);
            // std::cout << properties << "\n";

            // if (strstr((char*) nameString, "AVStream Camera 2500")) {
            //     g_free(nameString);
            //     continue;
            // }





            // Probe all device properties and store them in internal global videocapture device array:
            // devString = gst_device_get_device_class(device);
            // ProbeGstDevice(device, n, "DeviceMonitor", 0, (char*) devString, "", 0);
            // std::cout << (char*) device << "\n";
            // g_free(devString);
            // Increment count of detected devices for this plugin:
            n++;
            // Increment count of total detected devices for all plugins so far:
            // ntotal++;
        }
        g_list_free(devlist);
        gst_device_monitor_stop(Monitor);
    }
    gst_object_unref(GST_OBJECT(Monitor));

    return 1;
}
