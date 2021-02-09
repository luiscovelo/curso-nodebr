docker run --name postgres -e POSTGRES_USER=luiscovelo -e POSTGRES_PASSWORD=nodebr -e POSTGRES_DB=herois -p 3333:3333 -d postgres

docker ps
docker exec -it postgres /bin/bash
docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer

docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -e MONGO_INITDB_DATABASE=herois -d mongo:4
docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient

docker exec -it mongodb mongo --host localhost -u admin -p admin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({user: 'luiscovelo', pwd: 'luiscovelo', roles: [{role: 'readWrite', db: 'herois'}]})"