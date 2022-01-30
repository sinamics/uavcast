[![GithubCI](https://github.com/sinamics/uavcast/workflows/Build%20Container/badge.svg)](https://github.com/sinamics/uavcast/actions)

[![Release](https://img.shields.io/github/v/release/sinamics/uavcast.svg)](https://github.com/sinamics/uavcast/releases/latest)
[![Docker Pulls](https://img.shields.io/docker/pulls/sinamics/uavcast.svg)](https://hub.docker.com/r/sinamics/uavcast/)

# uavcast - companion software for remote :helicopter: :boat: :red_car:

uavcast 5.x has been re-written from the ground-up compared to the previouse versions, and are still missing key features before it is usable.

:warning: This project is still in development and does not have a stabel version yet. Feel free to make improvements and provide a PR.

Latest build of this repository can be found at:

- https://hub.docker.com/repository/docker/sinamics/uavcast

<br />

## :whale: Installation

To install developer version (supervisor & uavcast) on Rasperry PI, Jetson, or any <kbd>arm/v7</kbd> <kbd>arm64</kbd> <kbd>amd64</kbd> device:

- `curl -s http://install.uavmatrix.com/next/ | sudo bash`

<br />

## :notebook: Documentation

https://docs.uavmatrix.com/5.x/

<br />

## :hammer: Codebase

:white_check_mark: Express nodejs (Typescript)\
:white_check_mark: Typeorm && sqlite3 database\
:white_check_mark: React (Typescript)\
:white_check_mark: Semantic-ui-react\
:white_check_mark: graphql / type-graphql && codegen

<br />

## :wrench: Developer Instructions

### Prerequisites

:warning: These packages needs to be installed

:heavy_plus_sign: Docker\
:heavy_plus_sign: Docker Compose\
:heavy_plus_sign: Visual Studio Code

### :computer: Open the repo with Visual Studio Code

Upon opening, you should be prompted to open the project in a **remote container**. This will build a container on top of the base uavcast container with all the development dependencies installed. This ensures everyone uses a consistent development environment without the need to install any dependencies on your host machine.

If vscode does not start the remote container automatically, use hotkeys: <kbd>Ctrl</kbd> + <kbd>shift</kbd> + <kbd>p</kbd> and select <kbd>Remote-Container: Rebuild and Reopen container</kbd>

After starting the container for the first time, it will install some additional package, give it few minutes to complete.
![install](https://i.ibb.co/6XWg1sV/Skjermbilde-2022-01-19-202346.png)

<br />

### Run uavcast from the command line

VSCode will start the docker compose file for you and open a terminal window connected to `/app/uavcast` folder.

:heavy_minus_sign: Run `cd backend && npm install`\
:heavy_minus_sign: Run `cd frontend && npm install`\
:heavy_minus_sign: Run `npm start` from the project root to start both frontend & backend.

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

Example external publish:\
`./compile_release.sh --image_name sinamics/uavcast --version 5.x.x --docker_publish`

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

uavcast is provided under the [GNU Affero General Public License v3.0](https://github.com/sinamics/uavcast/blob/main/LICENSE).
