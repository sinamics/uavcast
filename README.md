# uavcast - companion software for remote vehicles

After several toughts and discussions with myself i finally came to the conclusion of publishing the whole uavcast 5.x dev build publically as open source in hopes that community will make this project become better and more advanced.

uavcast 5.x has been re-written from the ground-up compared to the previouse versions, and are still missing key features before it is usable.

Run devbuld.sh

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

Upon opening, you should be prompted to open the project in a remote container. This will build a container on top of the base uavcast container with all the development dependencies installed. This ensures everyone uses a consistent development environment without the need to install any dependencies on your host machine.

### Run uavcast from the command line

VSCode will start the docker compose file for you and open a terminal window connected to `/app/uavcast` folder.

- Run `cd backend && npm install`
- Run `cd frontend && npm install`
- Run `npm start` from the project root to start both frontend & backend.
