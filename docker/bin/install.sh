#!/bin/bash
#	----------------------------------------------------------------
#	uavcast dev-installation file.
#   Author Bernt Christian Egeland
#	----------------------------------------------------------------

Systemd="/etc/systemd/system"
APPROOT="/app/uavcast"

# Generate UAVcast.service file
UAVCAST=$Systemd/"uavcast.service"

/bin/cat <<EOM >$UAVCAST
[Unit]
Description=uavcast, casting controller
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=$APPROOT
Type=simple
GuessMainPID=no
ExecStart=$APPROOT/bin/build/uav_main -a
ExecStop=$APPROOT/bin/build/uav_main -s
RemainAfterExit=yes
KillMode=control-group
SyslogIdentifier=uavcast
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
WorkingDirectory=$APPROOT/bin/build
Type=simple
GuessMainPID=no
ExecStart=$APPROOT/bin/build/uav_camera -start
KillMode=control-group
SyslogIdentifier=uavcast-camera
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
WorkingDirectory=$APPROOT/bin/build
Type=simple
GuessMainPID=no
ExecStart=$APPROOT/bin/build/uav_vpn -o start
KillMode=control-group
SyslogIdentifier=uavcast-vpn
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
WorkingDirectory=$APPROOT
Type=simple
GuessMainPID=no
ExecStart=/usr/bin/node $APPROOT/backend/dist/index.js
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
ExecStart=$APPROOT/bin/mavlink/mavlink-routerd
StandardOutput=journal+console
StandardError=inherit
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target
EOM

## add mavlink config
mkdir -p /etc/mavlink-router
cp ${APPROOT}/etc/mavlink-router-example.conf /etc/mavlink-router/main.conf

#Install ZeroTier
sudo curl -s https://install.zerotier.com/ | sudo bash               

## Docker
sudo touch /var/run/docker.sock
sudo chmod 666 /var/run/docker.sock
sudo chown uavcast:docker /var/run/docker.sock

#start webserver
sudo systemctl enable uavcast-web
sudo systemctl start uavcast-web

#start mavlink
sudo systemctl enable mavlink-router
sudo systemctl start mavlink-router

echo "NODE_ENV=production" >> ~/.bashrc