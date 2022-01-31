
# *****************************************************
# Variables to control Makefile operation
MKDIR_P = mkdir -p
CC = g++
CXXFLAGS = -g -Wall

# LINK = -lpthread -lsqlite3 -ljsoncpp -lcurl `pkg-config --libs gstreamer-1.0 `
LINK = -lpthread -lsqlite3 -ljsoncpp -lcurl
# `pkg-config --libs opencv`
# ****************************************************
# Targets needed to bring the executable up to date
all: build_dir main status vpn diskid versionControl
main: main.o includes/camera.o includes/db.o includes/docker.o includes/modem.o includes/mavlink.o includes/utils.o includes/flight_controller.o includes/app.o includes/logger.o
	$(CC) $(CXXFLAGS) main.o includes/camera.o includes/db.o includes/docker.o includes/modem.o includes/mavlink.o includes/utils.o includes/flight_controller.o includes/app.o includes/logger.o -o build/uav_main $(LINK)

status: status.o includes/db.o includes/modem.o includes/utils.o
	$(CC) $(CXXFLAGS) status.o includes/db.o includes/modem.o includes/utils.o -o build/uav_status $(LINK)

vpn: vpn.o includes/db.o includes/utils.o
	$(CC) $(CXXFLAGS) vpn.o includes/db.o includes/utils.o -o build/uav_vpn $(LINK)

# docker: includes/camera.o includes/logger.o includes/docker.o includes/utils.o includes/db.o
# 	$(CC) $(CXXFLAGS) includes/camera.o includes/logger.o includes/docker.o includes/utils.o includes/db.o -o build/uav_camera $(LINK)

diskid: disk_id.o
	$(CC) $(CXXFLAGS) disk_id.o -o build/disk_id

versionControl: verctl.o includes/utils.o
	$(CC) -lcurl verctl.o includes/utils.o -o build/verctl $(LINK)

#Clean up method
clean:
	-rm *.o includes/*.o build/uav_status build/uav_main

build_dir:
	mkdir -p build

.PHONY: