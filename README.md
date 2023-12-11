Social Media Analytical Platform
==========

Social Media Analytical Platform is a Node.js Distributed Server for computational analysis of social Media posts.

# Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Features](#features)
- [Start Analytical Platform](#startAnalyticalPlatform)
  - [Start Seperate Consumer and Producer](#startSeperateConsumerandProducer)
  - [Authorise Expernal APPs](#authorise-apps)
- [Services](#services)
  - [Post Content Service](#postContentService)
  - [Post Content Analysis Service](#postContentAnalysisService)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Features
* Scalable Services to create Social Media Content
* Scalable Services to anaylysis Social Media Content
* Distributed event driven architecture
* Microservice Data pattern
* Kafka Node Stream Producer and Consumers having scalable topics
* Integrated with scalable Mysql, Mongo, Redis, Inmemory clusters.
* Services with user traking.
* Redia publisher and suscriber model for Inmemory Cache handling.

# Start Analytical Platform

* It requires Datebases connection as must to operate within services. So, we need to get Mysql, Mongo, Redis Server up. Also, Need to update Connections params in the `.env` files.
* After Cloning this Repo, It will require Nodejs (> v16).
* After that below commands will help to express server up.
  
1. `yarn install` 
2. `export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)`
3. `docker-compose up`
4. `node start.js`


## Start Seperate Consumer and Producer

* We can make some of pods as event consumers and rest as producers. Need to change `.env` params!
* `port` : By default server start at: `localhost:4001`
* `KAFKA_TOPIC_SUBSCRIBER=true` : pods will be up for producers and consumers both.
* `KAFKA_TOPIC_SUBSCRIBER=false` : After changing port to `port=4002` and kafka topic suscriber flag as `KAFKA_TOPIC_SUBSCRIBER=false`, pods will be up for producers only.

## Authorise Expernal APPs

* To authorise external APPs. Need to change `.env` params!
* We need to put `EXTERNAL_APP_VALIDATE=true` and `EXTERNAL_APP_VERIFIER_PUBLIC_KEY` Need to change `.env` params!
* `EXTERNAL_APP_VALIDATE=true` : Server will start authorising external requests.
* `EXTERNAL_APP_VERIFIER_PUBLIC_KEY=secret-key` : Secret key to verify the [jwt-token](https://jwt.io).

# Services

## Post Content Service

Post Content Service manages contents from external app. It takes contents with postId (unique).

### Fetch post conetent API by postId

``` js
curl --location --request GET 'localhost:4001/mediaService/api/v1/postContent/postId/1' \
--header 'Content-Type: application/json' \
--header 'x-app-name: user-service' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImFwcF9uYW1lIjoidXNlci1zZXJ2aWNlIn0.W7WFHMtCObjxJBwQ8dXSpIhXzn6a-KOAxcQr4CEo7Ds'
```

### Create post conetent API 

``` js
curl --location 'localhost:4001/mediaService/api/v1/postContent/posts' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImFwcF9uYW1lIjoidXNlci1zZXJ2aWNlIn0.W7WFHMtCObjxJBwQ8dXSpIhXzn6a-KOAxcQr4CEo7Ds' \
--header 'x-app-name: user-service' \
--header 'Content-Type: application/json' \
--data '{
    "postId" : 1,
    "content" : "Hey, First Content Created!"
}'
```


## Post Content Analysis Service

Post Content Analysis Service manages content analysis data points produces by post content service.
It basically listen/consumes events produces form content service. when ever a post content service recieves content from external apps, It produces events.

### Fetch API for post content analysis by postId

``` js
curl --location --request GET 'localhost:4001/mediaService/api/v1/postContentAnalysis/postId/1' \
--header 'Content-Type: application/json' \
--header 'x-app-name: user-service' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImFwcF9uYW1lIjoidXNlci1zZXJ2aWNlIn0.W7WFHMtCObjxJBwQ8dXSpIhXzn6a-KOAxcQr4CEo7Ds'
```


