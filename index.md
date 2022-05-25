![https://i.ibb.co/Vps9t4x/uavcast-logo.png](https://i.ibb.co/Vps9t4x/uavcast-logo.png)

[![GithubCI](https://github.com/sinamics/uavcast/workflows/Build%20Container/badge.svg)](https://github.com/sinamics/uavcast/actions)
[![Release](https://img.shields.io/github/v/release/sinamics/uavcast.svg)](https://github.com/sinamics/uavcast/releases/latest)
[![Docker Pulls](https://img.shields.io/docker/pulls/sinamics/uavcast.svg)](https://hub.docker.com/r/sinamics/uavcast/)

# Installation

Install latest uavcast version on Rasperry PI, Jetson, or any <kbd>arm/v7</kbd> <kbd>arm64</kbd> <kbd>amd64</kbd> device:

`curl -s http://install.uavmatrix.com/next/ | sudo bash`


# Documentation

[https://docs.uavmatrix.com/5.x/](https://docs.uavmatrix.com/5.x/)


# uavcast - companion software for remote uav vehicles

uavcast is an application that provides an easy method for streaming mavlink (telemetry) data and video over a LTE/4G or WiFi network.

This project is still in development and does not have a stabel version yet. Feel free to make improvements and provide a PR.

<br />

## Codebase

Express nodejs (Typescript)\
Typeorm && sqlite3 database\
React (Typescript)\
Semantic-ui-react\
graphql / type-graphql && codegen

<br />

## Developer Instructions

### Prerequisites

These packages needs to be installed

Docker\
Docker Compose\
Visual Studio Code

### Open the repo with Visual Studio Code

Upon opening, you should be prompted to open the project in a **remote container**. This will build a container on top of the base uavcast container with all the development dependencies installed. This ensures everyone uses a consistent development environment without the need to install any dependencies on your host machine.

If vscode does not start the remote container automatically, use hotkeys: <kbd>Ctrl</kbd> + <kbd>shift</kbd> + <kbd>p</kbd> and select <kbd>Remote-Container: Rebuild and Reopen container</kbd>

After starting the container for the first time, it will install some additional package, give it few minutes to complete.
![install](https://i.ibb.co/6XWg1sV/Skjermbilde-2022-01-19-202346.png)

<br />

### Run uavcast from the command line

VSCode will start the docker compose file for you and open a terminal window connected to `/app/uavcast` folder.

Run `cd backend && npm install`\
Run `cd frontend && npm install`\
Run `npm start` from the project root to start both frontend & backend.

### Supervisor

Uavcast uses a supervisor container to manage the application update ect. Supervisor is not needed for development.
To run the supervisor, type `cd supervisor && npm install && npm start` from the uavcast project root.

### Teardown

After closing VSCode, you may still have containers running. To close everything down, just run\
`docker-compose down -v` to cleanup all containers.

### Making changes

Do not make large sweeping changes. Open a discussion on GitHub for any large or architectural ideas.
Ensure lint passes. `npm run lint` This command will ensure basic conformance to styles, applying as many automatic fixes as possible, including Prettier formatting.

### Build docker locally

Use these commands in the project root (!not in the vscode developer container).\
Type `./compile_release.sh` + arguments to genereate local docker image, or you can publish to your own container registery.

Example local build:\
`./compile_release.sh --image_name sinamics/uavcast --version 5.x.x --docker_local`

run docker image locally:

```docker
docker run --restart unless-stopped --name uavcast -d \
    -v uavdata:/app/uavcast/data \
    -v /var/lib/zerotier-one:/var/lib/zerotier-one \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /dev:/dev \
    --privileged=true --net=host [image_name]:[version]
```

### Images

![Map](https://i.ibb.co/1zZTysD/Skjermbilde-2022-01-19-204037.png)
![Dashboard](https://i.ibb.co/7CpNwQS/Skjermbilde-2022-01-19-204107.png)

<br />

### Copyright and License

uavcast is provided under the [the 3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause).  
All license notes are listed in our documentation.
[https://docs.uavmatrix.com/5.x/libraries/](https://docs.uavmatrix.com/5.x/libraries/)
