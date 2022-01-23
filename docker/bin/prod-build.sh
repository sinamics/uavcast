#!/bin/bash
#	----------------------------------------------------------------
#	UAVcast installation file.
#   Author Bernt Christian Egeland
#	----------------------------------------------------------------
#Get current Directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

VERSION_ID=9 #set to default stretch

# Set folders
BASEFOLDER="$(cd ../; pwd)"
Systemd="/etc/systemd/system"
ROOTFOLDER="/app/uavcast"

main="$MAINPID"

sudo apt-get install -y libjsoncpp-dev \
                        libsqlite3-dev \
                        libv4l-dev \
                        libcap2-bin
                        
# Generate UAVcast.service file
UAVCAST=$Systemd/"uavcast.service"

/bin/cat <<EOM >$UAVCAST
[Unit]
Description=uavcast, casting controller
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=ROOTFOLDER
Type=simple
GuessMainPID=no
ExecStart=ROOTFOLDER/bin/build/uav_main -a
ExecStop=ROOTFOLDER/bin/build/uav_main -s
RemainAfterExit=yes
KillMode=control-group
StandardOutput=journal+console
StandardError=inherit
Restart=on-failure
[Install]
WantedBy=multi-user.target
EOM

# Generate UAVcast.service file
UAVCAST=$Systemd/"uavcast-camera.service"

/bin/cat <<EOM >$UAVCAST
[Unit]
Description=uavcast-camera controller
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=ROOTFOLDER
Type=simple
GuessMainPID=no
ExecStart=ROOTFOLDER/bin/build/uav_camera -start
KillMode=control-group
StandardOutput=journal+console
StandardError=inherit
[Install]
WantedBy=multi-user.target
EOM

# Generate UAVcast.service file
UAVCAST=$Systemd/"uavcast-vpn.service"

/bin/cat <<EOM >$UAVCAST
[Unit]
Description=uavcast-vpn controller
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=ROOTFOLDER
Type=simple
GuessMainPID=no
ExecStart=ROOTFOLDER/bin/build/uav_vpn -o start
KillMode=control-group
StandardOutput=journal+console
StandardError=inherit
[Install]
WantedBy=multi-user.target
EOM

# Generate UAVcast-Web.service file
UAVCASTWEB=$Systemd/"uavcast-web.service"

/bin/cat <<EOM >$UAVCASTWEB
[Unit]
Description=Webinterface for UAVcast
[Service]
WorkingDirectory=$ROOTFOLDER
Type=simple
GuessMainPID=no
ExecStart=/usr/bin/node $ROOTFOLDER/backend/dist/index.js
KillMode=control-group
SyslogIdentifier=uavcast-webinterface
StandardOutput=journal+console
StandardError=inherit
Restart=on-failure
RestartSec=10
Environment="NODE_ENV=production" "SERVER_PORT=80"
[Install]
WantedBy=multi-user.target
EOM

# Generate custom mavlink-routered systemd file
MAVLINKROUTERED=$Systemd/"mavlink-router.service"

/bin/cat <<EOM >$MAVLINKROUTERED
[Unit]
Description=MAVLink Router
[Service]
Type=simple
ExecStart=$ROOTFOLDER/bin/mavlink/mavlink-routerd
StandardOutput=journal+console
StandardError=inherit
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target
EOM

#Prevent Network Manager to control WIFI
mkdir -p /etc/NetworkManager
NetworkManager="/etc/NetworkManager/NetworkManager.conf"
/bin/cat <<EOM >$NetworkManager
[main]
plugins=ifupdown,keyfile

[ifupdown]
managed=false

[keyfile]
unmanaged-devices=interface-name:eth*,interface-name:wlan*
EOM

#start webserver
systemctl enable uavcast-web
systemctl start uavcast-web

#start mavlink
systemctl enable mavlink-router
systemctl start mavlink-router


echo "NODE_ENV=production" >> ~/.bashrc