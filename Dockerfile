# Needed for setting up the dist folder and its permissions
FROM node:18-bullseye
WORKDIR /app/
ARG DOCKER_USER
RUN mkdir dist && chown -R $DOCKER_USER dist
RUN mkdir /.npm && chown -R $DOCKER_USER /.npm
EXPOSE 5173
EXPOSE 3000

USER $DOCKER_USER