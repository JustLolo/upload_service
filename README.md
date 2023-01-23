# What is this?
This is a simple web application that allows you to upload multiple files in a concurrent way to an express server.


# How to make this run
## Install
Docker is used to run the application. You need to install docker and docker-compose.
Version used: 20.10.17

## Run
`export DOCKER_USER="$(id -u):$(id -g)"`
IMPORTANT! This is needed to run the application as the current user
if you don't do this, the files will be owned by root and you will have permission issues


To install the dependencies, run the following command in the root of the project:
    `docker compose run --rm frontend-dev npm ci`
    `docker compose run --rm backend-dev npm ci`

To run the application, run the following command in the root of the project:
    `docker compose --profile dev up -d --build`

### frontend(vite) running in a dev environment
frontend -> http://localhost:5173/
- it uses vite to watch for changes


### backend running in a dev environment
backend  -> http://localhost:80/
- it uses nodemon to watch for changes
- it uses the compiled files from the frontend

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
# upload_service
