# What is this?
This is a simple web application that allows you to upload multiple files in a concurrent way to an express server.
I did not impose any size constraints on the uploads. However, if a large set of files is uploaded, the server may crash due to memory overload. This is because I implemented this such as the backend keeps all the files in memory before saving them to disk.

# How to make this run
## Install
Docker is used to run the application. You need to install docker and docker-compose.
Version used: 20.10.17, but I think because it's docker this will run almost anywhere

__**IMPORTANT!**__ Are you using Windows OS? 
You have to either use this CLI https://gitforwindows.org/
or you have to use WSL2 https://docs.microsoft.com/en-us/windows/wsl/install-win10 (recommended)

## Run
    `export DOCKER_USER="$(id -u):$(id -g)"`
__**IMPORTANT!**__ This is needed to run the application as the current user
if you don't do this, the files will be owned by root and you will have permission issues



To install the dependencies, run the following command in the root of the project:
    `docker compose run --rm frontend-dev npm ci`
    `docker compose run --rm backend-dev npm ci`

To run the application, run the following command in the root of the project:
    `docker compose --profile dev up -d --build`

Build the bundle for the frontend, it's automatically served by the backend
    `docker compose exec frontend-dev npm run build`

### frontend(vite) running in a dev environment
frontend -> http://localhost:5173/
- it uses vite to watch for changes

### backend running in a dev environment
backend  -> http://localhost:80/
- it uses nodemon to watch for changes
- it uses the compiled files from the frontend, so you need to build the frontend first
- the volume of the dist folder of the frontend is mounted in the backend

### Serving the frontend from the backend
- Run the backend in a dev environment
- Build the frontend using `docker compose exec frontend-dev npm run build`


## Stop and remove containers
    `docker compose --profile dev down`

## Is there a way to make my life easier?
Yes, use VSCode and install the Remote Containers extension.

Then you can open the project in a container and code in the container.
This way you don't have to install anything on your machine.
aka no debugging, no npm, no node, no nothing, no dependencies, no nothing.
