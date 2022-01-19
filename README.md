# uavcast - companion software for remote vehicles

After several toughts and discussions with myself i finally came to the conclusion of publishing the uavcast 5.x dev build publically as open source in hope that community will collaborate and make this project better and more advanced.

uavcast 5.x has been re-written from the ground-up compared to the previouse versions, and are still missing key features before it is usable.

Latest build of this repository can be found at:

- https://hub.docker.com/repository/docker/sinamics/uavcast

To install latest version on Rasperry PI, Jetson, or any arm/v7, arm64 device:

- `curl -s http://install.uavmatrix.com/next/ | sudo bash`

## Documentation

https://docs.uavmatrix.com/5.x/

## Codebase

- [x] Backend nodejs (Typescript)
- [x] Frontend React (Typescript)
- [x] sqlite3 database
- [x] graphql && codegen
- [x] type-graphql

## Usage

### Prerequisites

- [x] Docker
- [x] Visual Studio Code

### Open the repo with Visual Studio Code

Upon opening, you should be prompted to open the project in a **remote container**. This will build a container on top of the base uavcast container with all the development dependencies installed. This ensures everyone uses a consistent development environment without the need to install any dependencies on your host machine.

After starting the container first time, it will install some additional package, give it few minutes to complete.
![install](https://i.ibb.co/6XWg1sV/Skjermbilde-2022-01-19-202346.png)

### Run uavcast from the command line

VSCode will start the docker compose file for you and open a terminal window connected to `/app/uavcast` folder.

- Run `cd backend && npm install`
- Run `cd frontend && npm install`
- Run `npm start` from the project root to start both frontend & backend.

### Teardown

After closing VSCode, you may still have containers running. To close everything down, just run docker-compose down -v to cleanup all containers.

### Making changes

Do not make large sweeping changes. Open a discussion on GitHub for any large or architectural ideas.
Ensure lint passes. `npm run lint` This command will ensure basic conformance to styles, applying as many automatic fixes as possible, including Prettier formatting.

### Build docker locally

use the `compile_release.sh` to genereate local docker image, or you can publish to your own container registery.
Example external publish:
`./compile_release.sh --version 5.0.0 --build_gcc --build_frontend --build_backend --docker_publish`

Example local build:
`./compile_release.sh --version 5.0.0 --build_gcc --build_frontend --build_backend --docker_local`
