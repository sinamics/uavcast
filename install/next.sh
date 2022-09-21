#!/bin/bash
#
# This is the install script running at install.uavmatrix.com/next
# See https://docs.uavmatrix.com/5.x/installation/ for installation information
# Author Bernt Christian Egeland


set -E -o functrace # Enable the err trap, code will get called when an error is detected

# Error codes
#  0  success
#  1  incorrect invocation or permissions
#  2  system error (out of memory, cannot fork, no more loop devices)
#  4  internal mount bug or missing nfs support in mount
#  8  user interrupt
# 16  problems writing or locking /etc/mtab
# 32  mount failure
# 64  some mount succeeded

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ARCH=$(dpkg --print-architecture)
HOST_OS=$(( lsb_release -ds || cat /etc/*release || uname -om ) 2>/dev/null | head -n1)
sudo apt-get update

if ! which jq >/dev/null; then
  sudo apt-get install jq -y
fi

function failure() {
  local -n _lineno="${1:-LINENO}"
  local -n _bash_lineno="${2:-BASH_LINENO}"
  local _last_command="$(sed -e 's/"//g' <<< "${3:-${BASH_COMMAND}}")"
  local _code="${4:-0}"

  local uname=$(uname -a | sed -e 's/"//g')

  ## Workaround for read EOF combo tripping traps
  if ! ((_code)); then
      return "${_code}"
  fi
  printf "\n${RED}An error occured! ${NC}\n" >&2

  jsonError=$(jq -n --arg kernel "$uname" \
      --arg version "/next" \
      --arg arch "$ARCH" \
      --arg os "$HOST_OS" \
      --arg command "$_last_command" \
      --arg timestamp $(date +"%d-%m-%Y/%M:%S") \
      --arg lineno "$_bash_lineno" \
      '{version: $version, kernel: $kernel, command: $command, lineno:$lineno, arch: $arch, os: $os, timestamp: $timestamp}')

  jq '.' <<< $jsonError >&2

  # errorMsg="Line: $_bash_lineno failed. command => $_last_command. error-code: $_code"
  # printf "\n${RED} $errorMsg ${NC}\n" >&2
  printf "\n${YELLOW}Do you want to send the error report to uavmatrix.com for application improvements? \n\e[4mOnly\e[0m ${YELLOW}the above error message will be sent! [yes/no]?${NC}\n\n" >&2
  printf "yes / no ==> " >&2
  read answer < /dev/tty

  finish="-1"
  while [ "$finish" = '-1' ]
  do
    finish="1"
    case $answer in
      y | Y | yes | YES | Yes)

      echo ">>> Generating Report..."
      echo ">>> Transmitting..."
      curl --insecure --max-time 10 \
      -d "$jsonError" \
      -H 'Content-Type: application/json' \
      -X POST "http://install.uavmatrix.com/post/error"
      # -X POST "http://localhost:9090/post/error"
      ;;
      n | N | no | NO | No )
      printf "Exiting! Please contact support@uavmatrix.com or create new issue at https://github.com/sinamics/uavcast/issues with the above information\n"
      exit 1
      ;;
      *) finish="-1";
        echo -n '>>> Invalid response -- please reenter [yes/no]:' >&2;
        read answer < /dev/tty;;

    esac
  done

  exit ${_code}
}

trap 'failure "LINENO" "BASH_LINENO" "${BASH_COMMAND}" "${?}"' ERR

CONTAINER_ID="uavcast"
SUPERVISOR_ID="supervisor"
UAVCAST_REPO="sinamics/uavcast"
SUPERVISOR_REPO="sinamics/uavcast-supervisor"
SYSTEMD="/etc/systemd/system"
REBOOTREQUIRED=0

# Check if another instance of apt-get is running, and wait for it to be ready.
while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 ; do
echo "Waiting for other apt-get instances to exit!"
# Sleep to avoid pegging a CPU core while polling this lock
sleep 5
done

uavcast_dockerhub=$(curl -s -S "https://registry.hub.docker.com/v2/repositories/sinamics/uavcast/tags/")
uavcast_version=$(echo $uavcast_dockerhub | jq '."results"[]["name"]' | sed 's/"//g' | sed -n 1p)
uavcast_size=$(echo $uavcast_dockerhub | jq '."results"[0]["full_size"]')

supvervisor_dockerhub=$(curl -s -S "https://registry.hub.docker.com/v2/repositories/sinamics/uavcast-supervisor/tags/")
supvervisor_version=$(echo $supvervisor_dockerhub | jq '."results"[]["name"]' | sed 's/"//g' | sed -n 1p)
supervisor_size=$(echo $supvervisor_dockerhub | jq '."results"[0]["full_size"]')

total_download_size=$((($supervisor_size + $uavcast_size) / 1024 / 1024))

exclude_uavcast=0
exclude_supvervisor=0
uninstall=0
uavcast_container_running=false
uavcast_supervisor_running=false

# use getopt and store the output into $OPTS
# note the use of -o for the short options, --long for the long name options
# and a : for any option that takes a parameter
OPTS=$(getopt -o "ru:s:qw" --long "uninstall,uavcast_version:,supvervisor_version:,exclude_uavcast,exclude_supvervisor" -n "$progname" -- "$@")
if [ $? != 0 ] ; then echo "Error in command line arguments." >&2 ; exit 1 ; fi


# curl -s http://install.uavmatrix.com/next/ | sudo bash -s -- --exclude_uavcast --exclude_supvervisor

eval set -- "$OPTS"
while true; do
  # uncomment the next line to see how shift is working
  # echo "\$1:\"$1\" \$2:\"$2\""
  case "$1" in
    -d | --docker ) docker_arg=$((docker_arg + 1)); shift ;;
    -q | --exclude_supvervisor ) exclude_supvervisor=$((exclude_supvervisor + 1)); shift ;;
    -w | --exclude_uavcast ) exclude_uavcast=$((exclude_uavcast + 1)); shift ;;
    -r | --uninstall ) uninstall=$((uninstall + 1)); shift ;;
    -u | --uavcast_version ) uavcast_version="$2"; shift 2 ;;
    -s | --supvervisor_version ) supvervisor_version="$2"; shift 2 ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

SUDO=
if [ "$UID" != "0" ]; then
	if [ -e /usr/bin/sudo -o -e /bin/sudo ]; then
		SUDO=sudo
	else
		echo '*** This quick installer script requires root privileges.'
		exit 0
	fi
fi

##
#
# If raspberry pi board, we need to disbale default bluetooth for enbaling serial over GPIO pins.
# Lets find out if current device is a rpi armv7 or not.
#
##
is_pizero() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]09[0-9a-fA-F]$" /proc/cpuinfo > /dev/null
  return $?
}
is_pizerow() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]0[cC][0-9a-fA-F]$" /proc/cpuinfo > /dev/null
  return $?
}
is_pizerow2() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]12[0-9a-fA-F]$" /proc/cpuinfo > /dev/null
  return $?
}
is_pione() {
  if grep -q "^Revision\\s*:\\s*00[0-9a-fA-F][0-9a-fA-F]$" /proc/cpuinfo; then
    return 0
  elif grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]0[0-36][0-9a-fA-F]$" /proc/cpuinfo; then
    return 0
  else
    return 1
  fi
}
is_cmone() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]06[0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_pitwo() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]04[0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_pithree() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]0[8dDeE][0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_cmthree() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]0[aA][0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_pithreeplus() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]0[dDeE][0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_cmthreeplus() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]10[0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_pifour() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]11[0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_pifour_8GB() {
  totalMemory="$(awk '/MemTotal/ {print $2}' /proc/meminfo)"
  if is_pifour && [[ $totalMemory -gt 5000000 ]]; then return 0; else return 1; fi
}
is_cmfour() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]14[0-9a-fA-F]$" /proc/cpuinfo
  return $?
}
is_pi400() {
  grep -q "^Revision\\s*:\\s*[ 123][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]13[0-9a-fA-F]$" /proc/cpuinfo
  return $?
}

is_armv6l() {
  if [[ "$hwarch" == "armv6l" ]]; then return 0; fi
  case "$(uname -m)" in
    armv6l) return 0 ;;
    *) return 1 ;;
  esac
}

#Check if any armv7 board.
is_pi_armv7() {
  if is_pifour || is_cmfour || is_pi400 || is_cmthreeplus || is_cmthree || is_pithreeplus || is_pithree || is_pitwo || is_pizerow2; then return 0; fi
  return 1
}


#version 5.x does not supprt armv6, exit
if is_armv6l; then
  printf "\n${YELLOW}UAVcast-Pro v5.x and beyond does not support armv6 (pi0w, rpi1, Compute Module 1), use v4.x for these boards!${NC}\n\n"
  exit 0
fi

# Check of enough free space
FREE=`df -k --output=avail "$PWD" | tail -n1`
FREEMB=$(($FREE / 1024))

if [[ $FREEMB -lt $total_download_size ]]; then             #at least 1500MB or 1,5GB
     echo $(tput setaf 1)There is not enough free space!$(tput sgr0)
     echo "$FREEMB MB available, this installation needs "$total_download_size" MB"
     printf "\n\n"
     echo "Please expand your filesystem. For RPI use $(tput setaf 3)raspi-config$(tput sgr0) or by just typing $(tput setaf 3)raspi-config --expand-rootfs$(tput sgr0)\n\n"
     exit
fi

if (($uninstall == 0)); then
  printf "\n${YELLOW}Data usage warning${NC}\n"
  printf "This installation needs to download ${YELLOW}${total_download_size} ${NC}MB\n"
  printf "If you are connected using LTE modem, you might want to use other connection methods to save data.\n\n\n"

  echo 'Press ENTER to continue or CTRL+C to exit...'
  read </dev/tty
fi

if [[ "$uninstall" -eq "1" ]]; then
  echo ">>> uninstall supervisor"
    SCID=$(sudo docker ps --all --format '{{.Names}}' -f name=^/supervisor$ | grep -w supervisor | awk '{print $1}')
    if [ "$SCID" != "" ];
    then
      docker stop $SCID >/dev/null 2>&1
      docker rm $SCID -f >/dev/null 2>&1
    else
      printf ">>> No running containers found, skipping\n"
    fi

  docker rmi -f $(docker images --format '{{.Repository}}:{{.Tag}}' | grep ${SUPERVISOR_REPO}) >/dev/null || :

  echo ">>> uninstall uavcast-pro"
    UCID=$(sudo docker ps --all --format '{{.Names}}' -f name=^/uavcast$ | grep -w uavcast | awk '{print $1}')
    if [ "$UCID" != "" ];
    then
      docker stop $UCID >/dev/null 2>&1
      docker rm $UCID >/dev/null 2>&1
    else
      printf ">>> No running containers found, skipping\n"
    fi

  docker rmi -f $(docker images --format '{{.Repository}}:{{.Tag}}' | grep ${UAVCAST_REPO}) >/dev/null 2>&1 || :
  echo ">>> uninstall uavcast user"
  $SUDO userdel uavcast >/dev/null 2>&1 || :
  $SUDO rm -rf /home/uavcast >/dev/null 2>&1 || :

  # Restart apache2 service, if it exists.
  if systemctl cat UAVcast-Web >/dev/null 2>&1; then
    echo ">>> Version > 4.x is installed, lets start it."
    systemctl start UAVcast-Web --quiet
    systemctl enable UAVcast-Web --quiet
    echo ">>> started webinterface for version > 4.x"
  fi
  echo ">>> uninstall uavcast volume"
  docker volume rm uavdata >/dev/null 2>&1 || :

  echo ">>> UAVcast-Pro 5.x has been uninstalled successfully"
  exit
fi

# check if version > 4.x is installed on the device and stop services.
if systemctl is-active --quiet UAVcast-Web
then
  systemctl stop UAVcast-Web --quiet
  systemctl disable UAVcast-Web --quiet
fi

if systemctl is-active --quiet mavlink-router
then
  systemctl stop mavlink-router --quiet
fi

validate_docker_installation(){
  if ! systemctl is-active --quiet docker
  then
    error_msg() {
      printf "Try running the installer again or you might want to try install docker yourself.\n"
      printf "https://docs.docker.com/engine/install \n\n"
    }
    printf "${YELLOW}Docker deamon not running!.${NC}\n"
    printf "Should we try to re-install docker?\n"

    printf "yes / no ==> " >&2
    read answer < /dev/tty
    case $answer in
        y | Y | yes | YES | Yes)

        echo ">>> Uninstall old docker deamon"
        $SUDO apt-get purge -y docker-ce docker-ce-cli containerd.io docker-compose-plugin >/dev/null 2>&1 || :

        echo ">>> Re-insall docker deamon"
        install_docker

        if ! systemctl is-active --quiet docker
        then
          printf "Exiting! Could not install docker.\n\n"
          error_msg
          exit 1
        fi
        ;;
        n | N | no | NO | No )
        error_msg
        printf "If the problem persist, create new issue at https://github.com/sinamics/uavcast/issues\n"
        exit 1
        ;;
        *) finish="-1";
          echo -n '>>> Invalid response -- please reenter [yes/no]:' >&2;
          read answer < /dev/tty;;
      esac
  fi
}

install_docker() {
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh || validate_docker_installation
}

# install docker if not already installed.
if ! which docker >/dev/null && ! which docker --version >/dev/null; then
  printf "Docker is not installed, lets get it\n"
  install_docker
fi

validate_docker_installation

$SUDO chmod 666 /var/run/docker.sock

# if ! getent passwd uavcast > /dev/null 2>&1; then
if [[ $(getent passwd uavcast) = "" ]]; then
    echo ">>> Create uavcast user"
    $SUDO useradd -m uavcast
    $SUDO usermod -aG sudo uavcast
    $SUDO usermod -aG docker uavcast
    # $SUDO newgrp docker
fi

fifi_pipe="/home/uavcast/uavpipe"
if [[ ! -p "${fifi_pipe}" ]]; then
    printf ">>> Creating host-pipe ${fifi_pipe} \n"
    mkfifo "${fifi_pipe}"
fi

##
# we need to set miniuart-bt in config.txt and remove console output in cmdline.txt.
# This will only applu for rpi boards.
##
if is_pi_armv7; then
  echo ">>> Raspberry Pi detected, moving bluetooth to secondary serial port! (miniuart-bt)"
  BOOTCFG=/boot/config.txt
  CMDLINE=/boot/cmdline.txt
  REBOOTREQUIRED=1

  systemctl disable hciuart >/dev/null 2>&1 || :

  if ! grep -q "dtoverlay=miniuart-bt" $BOOTCFG; then
    echo "dtoverlay=miniuart-bt" >> $BOOTCFG
  fi
  echo ">>> Removing console output in cmdline.txt"
  sed -i $CMDLINE -e "s/console=ttyAMA0,[0-9]\+ //"
  sed -i $CMDLINE -e "s/console=serial0,[0-9]\+ //"
fi


if [[ "$exclude_supvervisor" -eq "0" ]]; then
    echo ">>> Installing Supervisor"
    if ! curl --silent -f -lSL "https://registry.hub.docker.com/v2/namespaces/sinamics/repositories/uavcast-supervisor/tags/${supvervisor_version}" >/dev/null 2>&1; then
        printf "\n${YELLOW}Supervisor version ${supvervisor_version} does not exsist!. Exiting..${NC}\n\n"
        exit 0
    fi

    printf ">>> Creating host-pipe service\n"
    PIPEFILE="/home/uavcast/uavpipe.sh"
    echo '#!/bin/bash' > $PIPEFILE
    echo 'while true; do eval "$(cat /home/uavcast/uavpipe)"; done' >> $PIPEFILE
    chmod +x /home/uavcast/uavpipe.sh

UAVPIPESERVICE=$SYSTEMD/"uavpipe.service"
/bin/cat <<EOM >$UAVPIPESERVICE
[Unit]
Description=supervisor-pipe service
Requires=network-online.target
Wants=network-online.target
After=network-online.target
[Service]
WorkingDirectory=/home/uavcast/
Type=simple
GuessMainPID=no
ExecStart=/home/uavcast/uavpipe.sh
KillMode=control-group
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=supervisor-pipe
Restart=on-failure
RestartSec=10
[Install]
WantedBy=multi-user.target
EOM

    # restart daemon
    sudo systemctl daemon-reload
    sudo systemctl enable uavpipe
    sudo systemctl start uavpipe

    printf ">>> remove previous supervisor containers\n"
    CID=$(sudo docker ps --all --format '{{.Names}}' -f name=^/supervisor$ | grep -w supervisor | awk '{print $1}')
    if [ "$CID" != "" ];
    then
      sudo docker stop $CID >/dev/null 2>&1
      sudo docker rm $CID -f >/dev/null 2>&1
    else
      printf ">>> No running containers found, skipping\n"
    fi

    printf ">>> Downloading latest supervisor container\n"
    docker pull sinamics/uavcast-supervisor:${supvervisor_version}

    printf ">>> Starting supervisor container\n"
    docker run --restart unless-stopped --name supervisor \
    --net=host -d --privileged -v /var/run/docker.sock:/var/run/docker.sock \
    -v /home/uavcast/uavpipe:/home/uavpipe \
    sinamics/uavcast-supervisor:${supvervisor_version}

    uavcast_supervisor_running=$( docker inspect -f {{.State.Running}} $SUPERVISOR_ID)
    if [[ $uavcast_supervisor_running = "true" ]]; then
      printf ">>> Prune unused supervisor images(s)\n"
      docker rmi $(docker images --format '{{.Repository}}:{{.Tag}}' | grep uavcast-supervisor) >/dev/null 2>&1 || :
      printf "\n\n${GREEN}Supervisor started successfully${NC}\n\n"
    else
      printf "\n\n${RED}Could not start Supervisor container.${NC}\n"
    fi
fi

if [[ "$exclude_uavcast" -eq "0" ]]; then
    printf  ">>> Installing UAVcast-Pro\n"
    if ! curl --silent -f -lSL "https://registry.hub.docker.com/v2/namespaces/sinamics/repositories/uavcast/tags/${uavcast_version}" >/dev/null 2>&1; then
      printf "\n${YELLOW}UAVcast-pro version ${uavcast_version} does not exsist!. Exiting..${NC}\n\n"
      exit 0
    fi
    printf ">>> UAVcast will be restarted shortly with the new version! \n"
    ## !User will not see any comment bellow!

    printf ">>> Remove old version \n"
    CID=$(sudo docker ps --all --format '{{.Names}}' -f name=^/uavcast$ | grep -w uavcast | awk '{print $1}')
    if [ "$CID" != "" ];
    then
      sudo docker stop $CID >/dev/null 2>&1
      sudo docker rm $CID >/dev/null 2>&1
    else
      printf ">>> No running containers found, skipping\n"
    fi

    printf ">>> Downloading ${uavcast_version}\n"
    docker pull ${UAVCAST_REPO}:${uavcast_version}

    #get latest version tag
    #docker image inspect --format '{{json .RepoTags}}' sinamics/uavcast:latest
    printf ">>> Starting uavcast version ${uavcast_version}\n"
    docker run \
      --restart unless-stopped --name uavcast -d \
      -v uavdata:/app/uavcast/data \
      -v /var/lib/zerotier-one:/var/lib/zerotier-one \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v /dev:/dev \
      --privileged=true --net=host ${UAVCAST_REPO}:${uavcast_version}

    uavcast_container_running=$( docker inspect -f {{.State.Running}} $CONTAINER_ID)
    if [ $uavcast_container_running = "true" ]; then
      printf ">>> Prune unused uavcast-pro images(s)\n"
      docker rmi $(docker images --format '{{.Repository}}:{{.Tag}}' | grep uavcast-pro) >/dev/null 2>&1 || :
      docker image prune -f

      printf "\n\n${GREEN}UAVcast has been deployed successfully${NC}\n"
      printf "UAVcast-PRO installation completed.\n"
      printf "You can access UAVcast webinterface by opening your browser\n"
      printf "and type the IP address below\n\n"
      printf "${YELLOW}http://"
      hostname -I | cut -f1 -d' '
      printf "${NC}\n\n"

      if (( $REBOOTREQUIRED > 0 )); then
        printf "${YELLOW}Please reboot your device to enable all features!${NC}"
      fi

      printf "\n\n"
    else
      printf "\n\n${RED}Something went wrong, please try again or contact support@uavmatrix.com with the bellow information${NC}\n\n"
      uname -a
      uname -n
      cat /etc/os-release
      dpkg --print-architecture
    fi
fi

set +e
