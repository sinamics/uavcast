#include <iostream>
#include <stdexcept>
#include <stdio.h>
#include <string>
#include <gst/gst.h>
#include "camera.h"

// #include <gst/app/gstappsink.h>
// sudo apt-get install libmm-glib-dev
// sudo apt-get install libglib2.0-dev
// sudo apt-get install libnm-util-dev
std::string Camera::invokeUsbCamera()
{
    // Utils utils;
    // std::string res = utils.exec("sudo ./external/./usbController.cast -a start");
    // if (res.find("error"))
    // {
    //     std::cout << "feilet" << '\n';
    // }
    return 0;
}

std::string Camera::video_test_src(int arg, char *argv[])
{
    GstElement *pipeline = nullptr;
    GstBus *bus = nullptr;
    GstMessage *msg = nullptr;

    // gstreamer initialization
    gst_init(&arg, &argv);

    // building pipeline
    pipeline = gst_parse_launch(
        "videotestsrc ! x264enc ! video/x-h264, stream-format=byte-stream ! rtph264pay ! udpsink host=10.0.0.27 port=5600",
        nullptr);

    // start playing
    gst_element_set_state(pipeline, GST_STATE_PLAYING);

    //wait until error or EOS ( End Of Stream )
    bus = gst_element_get_bus(pipeline);
    msg = gst_bus_timed_pop_filtered(bus, GST_CLOCK_TIME_NONE,
                                     static_cast<GstMessageType>(GST_MESSAGE_ERROR | GST_MESSAGE_EOS));

    // free memory
    if (msg != nullptr)
        gst_message_unref(msg);
    gst_object_unref(bus);
    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(pipeline);

    return 0;
}

int Camera::video_udp(int arg, char *argv[])
{

    // std::cout << std::string(argv[i]) << "\n";

    GstElement *pipeline, *videosrc, *conv, *enc, *pay, *udpsink, *caps, *filter = nullptr;
    GstCaps *Cap;
    //    v4l2src device={0} ! {3},width={1},height={2} ! {4} ! videoconvert ! video/x-raw,format=I420 ! videobalance contrast={5} brightness={6} ".format(device, res[0], res[1], format, devrotation, brightness / 100, contrast / 100)
    //             s_h264 = "x264enc tune=zerolatency bitrate={0} speed-preset=superfast".format(bitrate)

    // init GStreamer
    gst_init(&arg, &argv);
    GMainLoop *loop = g_main_loop_new(NULL, FALSE);

    // setup pipeline
    pipeline = gst_pipeline_new("pipeline");

    caps = gst_element_factory_make("capsfilter", "caps");

    videosrc = gst_element_factory_make("v4l2src", "source");

    conv = gst_element_factory_make("videoconvert", "conv");

    enc = gst_element_factory_make("x264enc", "enc");

    pay = gst_element_factory_make("rtph264pay", "pay");
    g_object_set(G_OBJECT(pay), "config-interval", 1, NULL);

    udpsink = gst_element_factory_make("udpsink", "udp");

    if (!pipeline || !videosrc || !conv || !enc || !udpsink)
    {
        g_printerr("One element could not be created. Exiting.\n");
        return -1;
    }

    // g_object_set(G_OBJECT(filter), "caps",
    //              gst_caps_new_simple("video/x-raw",
    //                                  "format", G_TYPE_STRING, "I420",
    //                                  "width", G_TYPE_INT, 160,
    //                                  "height", G_TYPE_INT, 120,
    //                                  "pixel-aspect-ratio", GST_TYPE_FRACTION, 1, 1,
    //                                  "framerate", GST_TYPE_FRACTION, 10, 1,
    //                                  NULL),
    //              NULL);
    /*set der source*/
    g_object_set(videosrc, "device", "/dev/video0", NULL);

    g_object_set(G_OBJECT(udpsink), "host", "10.0.0.27", NULL);
    g_object_set(G_OBJECT(udpsink), "port", 5600, NULL);
    // g_object_set(G_OBJECT(videosrc), "device", "/dev/video0", NULL);
    /* setup */

    /* Link the camera source and colorspace filter using capabilities * specified */
    // if (!gst_element_link_filtered(videosrc, csp_filter, caps))
    // {
    //     return FALSE;
    // }

    //caps
    Cap = gst_caps_from_string("video/x-raw,format=I420, width=320, height=240,framerate=20/1");
    filter = gst_element_factory_make("capsfilter", "filter");
    g_object_set(filter, "caps", Cap, NULL);

    //Link
    gst_bin_add_many(GST_BIN(pipeline), videosrc, conv, enc, pay, udpsink, NULL);

    if (gst_element_link_many(videosrc, conv, enc, pay, udpsink, NULL) != TRUE)
    {
        return -1;
    }

    gst_caps_unref(Cap);

    // play
    gst_element_set_state(pipeline, GST_STATE_PLAYING);
    g_main_loop_run(loop);

    // clean up
    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(GST_OBJECT(pipeline));
    g_main_loop_unref(loop);

    return 0;
}