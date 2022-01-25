#!/bin/bash
#	----------------------------------------------------------------
#	UAVcast installation file.
#   Author Bernt Christian Egeland
#
#   !Production specific addons
#	----------------------------------------------------------------

# Set folders
APPROOT="/app/uavcast"

#start webserver
systemctl enable uavcast-web
systemctl start uavcast-web

#start mavlink
systemctl enable mavlink-router
systemctl start mavlink-router


