#!/bin/bash
#	----------------------------------------------------------------
#	uavcast dev-installation file.
#   Author Bernt Christian Egeland
#	----------------------------------------------------------------

Systemd="/etc/systemd/system"
APPROOT="/app/uavcast"

# install global dependencies
npm i concurrently ts-node-dev typescript -g

sudo apt-get install -y libjsoncpp-dev \
                        libsqlite3-dev \
                        libv4l-dev \
                        libcap2-bin

sudo ln -s /usr/include/libv4l1-videodev.h   /usr/include/linux/videodev.h
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

# fetch translations
# https://github.com/UAVmatrix/uavcast-pro-translations
git submodule update --init --recursive

# Generate UAVcast.service file
UAVCAST=$Systemd/"uavcast.service"
touch $UAVCAST
/bin/cat <<EOM >$UAVCAST
[Unit]
Description=uavcast, casting controller
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=$APPROOT/bin/build
Type=forking
GuessMainPID=no
ExecStart=$APPROOT/bin/build/uav_main -a
ExecStop=$APPROOT/bin/build/uav_main -s
RemainAfterExit=yes
KillMode=control-group
SyslogIdentifier=uavcast
Restart=on-failure
StandardOutput=journal+console
StandardError=inherit
[Install]
WantedBy=multi-user.target
EOM

# Generate UAVcast.service file
CAMERA=$Systemd/"uavcast-camera.service"
touch $CAMERA
/bin/cat <<EOM >$CAMERA
[Unit]
Description=uavcast-camera controller
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=$APPROOT/bin/build
Type=simple
GuessMainPID=no
ExecStart=$APPROOT/bin/build/uav_camera -start
#ExecStop=$APPROOT/bin/build/uav_camera -stop
KillMode=control-group
SyslogIdentifier=uavcast-camera
StandardOutput=journal+console
StandardError=inherit
[Install]
WantedBy=multi-user.target
EOM


# Generate custom mavlink-routered systemd file
MAVLINKROUTERED=$Systemd/"mavlink-router.service"
touch $MAVLINKROUTERED
/bin/cat <<EOM >$MAVLINKROUTERED
[Unit]
Description=MAVLink Router
[Service]
Type=simple
ExecStart=$APPROOT/bin/mavlink/mavlink-routerd
Restart=on-failure
RestartSec=5
StandardOutput=journal+console
StandardError=inherit
[Install]
WantedBy=multi-user.target
EOM


ARCH=`uname -m`
if [ "$ARCH" == "x86_64" ]; then
    cp ${APPROOT}/bin/mavlink/mavlink-routerd-amd64 ${APPROOT}/bin/mavlink/mavlink-routerd
elif [ "$ARCH" == "armv7l" ]; then
    cp ${APPROOT}/bin/mavlink/mavlink-routerd-arm ${APPROOT}/bin/mavlink/mavlink-routerd
else
    cp ${APPROOT}/bin/mavlink/mavlink-routerd-arm64 ${APPROOT}/bin/mavlink/mavlink-routerd
fi

## add mavlink config
mkdir -p /etc/mavlink-router
cp ${APPROOT}/etc/mavlink-router-example.conf /etc/mavlink-router/main.conf

## Docker
sudo touch /var/run/docker.sock
sudo chmod 666 /var/run/docker.sock
sudo chown uavcast:docker /var/run/docker.sock

# Build binaries
cd /app/uavcast/bin && make