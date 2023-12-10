# media-service
Social Media Analytical Platform

Simple Steps to start the node server

1. yarn install 
2. export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
3. docker-compose up
4. we can make some of pods as event consumer with .env parameter `KAFKA_TOPIC_SUBSCRIBER=true`, Other event producers as `KAFKA_TOPIC_SUBSCRIBER=false`. 
    This will enanle event driven distributed services infra.
4. node start.js
