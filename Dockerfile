# # gets you layer on top of which you can have your application layer, maybe kernel (BASE IMAGE)
# FROM alpine:latest

# # RUN is to execute any linux command, install node and npm
# RUN apk add --update nodejs npm

# # set working directory
# WORKDIR /app

# # install dependencies
# COPY package.json package.json
# RUN npm install

# # copy source code
# COPY . .

# #CMD executes the entry point linux commands,  start app, each docker can have only one CMD
# CMD ["npm", "run", "start"]


# # every command here will only affect the container and not my local environment


FROM alpine:latest
RUN apk add nodejs npm
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
# EXPOSE 8000
ENV NODE_ENV=docker
CMD ["npm", "run", "start"]
