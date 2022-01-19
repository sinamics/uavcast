#!/usr/bin/env bash
set -e

sudo /bin/systemctl >> waitforit.txt

sleep 3
# Make sure we set the webport stored in the database, if user uses another port than standard 80
/app/uavcast/bin/build/uav_main -p >> waitforit.txt

# sleep 3
# systemctl restart uavcast-web >> waitforit.txt

exec "$@"