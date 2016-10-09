FROM mhart/alpine-node:0.10

MAINTAINER Ben Simpson, ben@newcrossfoodcoop.org.uk

RUN apk update
RUN apk add python make g++
RUN rm -r /var/cache/apk

WORKDIR /home/app

RUN npm install -g gulp

ADD package.json /home/app/package.json
RUN npm install

ADD gulpfile.js /home/app/gulpfile.js

# Make everything available for start
ADD . /home/app

# Run tests
RUN gulp test

# Run build
RUN gulp build

# Volumes
VOLUME /home/app/api/content/data

# 3020 3021 for api dev/test 
# 2368 for ghost
# 5858 for debug
EXPOSE 3020 3021 5858 2368


# CMD ["gulp","api"]
# for production:
# CMD ["gulp","prod:api"]
CMD ["gulp"]
