#!/bin/bash
#	----------------------------------------------------------------
#	uavcast dev-installation file.
#   Author Bernt Christian Egeland
#
#   !Dev specific addons
#	----------------------------------------------------------------

APPROOT="/app/uavcast"

# install global dependencies
# npm i concurrently ts-node-dev typescript -g

sudo ln -s /usr/include/libv4l1-videodev.h   /usr/include/linux/videodev.h
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

# fetch translations
# https://github.com/UAVmatrix/uavcast-pro-translations
git submodule update --init --recursive

ARCH=`uname -m`
if [ "$ARCH" == "x86_64" ] || [ "$ARCH" = "amd64" ]; then
    cp ${APPROOT}/bin/mavlink/mavlink-routerd-amd64 ${APPROOT}/bin/mavlink/mavlink-routerd
elif [ "$ARCH" == "armv7l" ]; then
    cp ${APPROOT}/bin/mavlink/mavlink-routerd-arm ${APPROOT}/bin/mavlink/mavlink-routerd
elif [ "$ARCH" == "aarch64" ]; then
    cp ${APPROOT}/bin/mavlink/mavlink-routerd-arm64 ${APPROOT}/bin/mavlink/mavlink-routerd
fi

sudo apt-get install -y usbutils

# Build binaries
cd /app/uavcast/bin && make