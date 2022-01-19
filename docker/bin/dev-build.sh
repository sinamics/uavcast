#!/bin/bash
#	----------------------------------------------------------------
#	uavcast dev-installation file.
#   Author Bernt Christian Egeland
#	----------------------------------------------------------------

Systemd="/etc/systemd/system"
APPROOT="/app/uavcast"

# install global dependencies
npm i concurrently ts-node-dev typescript -g

sudo apt-get install -y libsqlite3-dev

sudo apt-get install -y jq dnsutils usb-modeswitch modemmanager openvpn \
network-manager-openvpn dh-autoreconf gstreamer-1.0 gstreamer1.0-tools gstreamer1.0-omx \
gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-plugins-bad python-pip \
libgstreamer-plugins-base1.0* libgstreamer1.0-dev libgstrtspserver-1.0-dev gstreamer1.0-plugins-base-apps \
python3-gi python3 python3-dev python3-pip python3-gst-1.0 network-manager

sudo apt-get install -y libv4l-dev && sudo ln -s /usr/include/libv4l1-videodev.h   /usr/include/linux/videodev.h
sudo apt-get install -y libjsoncpp-dev

# Allow non sudo user to host on port 80
sudo apt-get install -y libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``



# fetch translations
# https://github.com/UAVmatrix/uavcast-pro-translations
git submodule update --init --recursive

# Build binaries
cd /app/uavcast/bin && make

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
[Install]
WantedBy=multi-user.target
EOM

# restart mavlink-router if already running
# if systemctl is-active --quiet mavlink-router
# then
#     sudo systemctl restart mavlink-router
# else

FILE="/etc/mavlink-router/main.conf"
mkdir -p /etc/mavlink-router && touch $FILE

/bin/cat <<EOM >$FILE
[General]
    TcpServerPort=5790
    ReportStats=false
    MavlinkDialect=auto

[UartEndpoint controller]
    Device=/dev/ttyACM0
    Baud=57600

[UdpEndpoint localhost]
    Mode=Normal
    Address=127.0.0.1
    Port=12550
EOM
#     sudo systemctl start mavlink-router
# fi
