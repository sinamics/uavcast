#!/usr/bin/env bash
DIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
SECONDS=0
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

progname=$(basename $0)
docker_local=0
docker_publish=0
alfa=0
beta=0
version_arg=
image_name=sinamics/uavcast
# usage function
function usage()
{
   cat << HEREDOC

   Usage: $progname [ --version VERSION ] [ --version ] [ --docker_publish ] [ --docker_local ]

   Example publish:
    ./compile_release.sh --image_name sinamics/uavcast --version 5.0.0-rc1 --docker_publish

   Example local build:
    ./compile_release.sh --image_name sinamics/uavcast --version 5.0.0-rc1 --docker_local

   optional arguments:
     -h, --help                 Show help
     -n, --image_name           Docker image name (repo/name)
     -v, --version              Set app version (repo/name:[version])
     -d, --docker_local         Build docker image locally
     -p, --docker_publish       Publish docker image to dockerhub

HEREDOC
}


# use getopt and store the output into $OPTS
# note the use of -o for the short options, --long for the long name options
# and a : for any option that takes a parameter
OPTS=$(getopt -o "hdpv:n:" --long "help,docker_local,docker_publish,version:,image_name:" -n "$progname" -- "$@")
if [ $? != 0 ] ; then echo "Error in command line arguments." >&2 ; usage; exit 1 ; fi
if [ $# == 0 ] ; then usage; exit 1 ; fi

eval set -- "$OPTS"
while true; do
  # uncomment the next line to see how shift is working
#   echo "\$1:\"$1\" \$2:\"$2\""
  case "$1" in
    -h | --help ) usage; exit; ;;
    -n | --image_name ) image_name="$2"; shift 2 ;;
    -v | --version ) version_arg="$2"; shift 2 ;;
    -d | --docker_local ) docker_local=$((docker_local + 1)); shift ;;
    -p | --docker_publish ) docker_publish=$((docker_publish + 1)); shift ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

if (( $docker_local > 0 )) &&  [[ -z "$version_arg" ]]; then
    printf "$(tput setaf 3)"
    printf "You need to specify a version tag if docker build is set!\n"
    printf "$(tput sgr0)"
    exit
fi

if (( $docker_publish > 0 )) &&  [[ -z "$version_arg" ]]; then
    printf "$(tput setaf 3)"
    printf "You need to specify a version tag if docker publish is set!\n"
    printf "$(tput sgr0)"
    exit
fi

# update submodules
# sudo git submodule update --init --recursive

# set version nummer as enviroment
if [[ ! -f "$DIR/frontend/.env" ]]; then
    echo "REACT_APP_UAVCAST_VER=\"$version_arg"\" > $DIR/frontend/.env
else
    sed -i 's/REACT_APP_UAVCAST_VER=.*/REACT_APP_UAVCAST_VER='\"$version_arg\"'/' $DIR/frontend/.env
fi

# crypt
#If file is older than one year, abort. User will get notified.
DATEMESSAGE="Your version of uavcast has expired and will no longer work. Please update your version, see https://docs.uavmatrix.com. If you have any further questions, please contact UAVmatrix, support@uavmatrix.com"


# Set filename
FILENAME=$COMPILETYPE'_'master.tar
if (( $alfa > 0 )); then
    FILENAME=$COMPILETYPE'_'alfa.tar
fi

# Beta build
if (( $beta > 0 )); then
    FILENAME=$COMPILETYPE'_'beta.tar
fi

if (( $docker_local > 0 )); then
    echo "building image $image_name:$version_arg"
    docker buildx create --name uavcast_builder
    docker buildx use uavcast_builder
    docker buildx build --pull --rm -f "docker/Dockerfile.publish" \
    --platform linux/arm/v7 \
    -t sinamics/uavcast:$version_arg "." --output "type=docker,name=sinamics/uavcast:${version_arg}"

    # docker build --pull --rm -f "Dockerfile" -t sinamics/uavcast:$version_arg "."

    # buildctl build --local context=. --local dockerfile=. \
    # --frontend dockerfile.v0 --opt platform=linux/arm,linux/arm64 \
    # --output type=image,name=docker.io/sinamics/uavcast:$version_arg,push=true
fi

if (( $docker_publish > 0 )); then
    echo "building image $image_name:$version_arg"
    # run multiarch bild container
    #Docker Buildx
    docker buildx create --name uavcast_builder
    docker buildx use uavcast_builder
    docker run --privileged --rm tonistiigi/binfmt --install all

    docker buildx build --pull --rm -f "docker/Dockerfile.publish" \
    --platform linux/arm/v7,linux/arm64,linux/amd64 \
    -t $image_name:$version_arg "." --push

    # docker login #-u $DOCKER_USER -p $DOCKER_PASS
    # docker push $image_name:${version_arg}
fi


# Time the compile time
if (( $SECONDS > 3600 )) ; then
    let "hours=SECONDS/3600"
    let "minutes=(SECONDS%3600)/60"
    let "seconds=(SECONDS%3600)%60"
    printf "${YELLOW}\n\nCompleted in $hours hour(s), $minutes minute(s) and $seconds second(s)${NC}\n"
elif (( $SECONDS > 60 )) ; then
    let "minutes=(SECONDS%3600)/60"
    let "seconds=(SECONDS%3600)%60"
    printf "${YELLOW}\n\nCompleted in $minutes minute(s) and $seconds second(s)${NC}\n"
else
    printf "${YELLOW}\n\nCompleted in $SECONDS seconds${NC}\n"
fi

# assign moby containre to buildx
# docker buildx create --driver-opt image=moby/buildkit:latest --use
# docker run --privileged --rm tonistiigi/binfmt --install all
# docker run --privileged --rm tonistiigi/binfmt --install arm64,arm/v7,amd64