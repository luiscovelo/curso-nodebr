// docker ps
// docker exec -it 0a0110a80bfd mongo -u luiscovelo -p luiscovelo --authenticationDatabase herois

show dbs
use herois

show collections

db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-21'
})

db.herois.find().pretty()

db.herois.update({_id: ObjectId("5f072b37782e9ffd073a0302")}, {nome: 'Mulher Maravilha'})
db.herois.update({_id: ObjectId("5f072b37782e9ffd073a0301")}, { $set: {nome: 'Lanterna Verde'}})

db.herois.remove({})
db.herois.remove({_id: ObjectId("5f072b37782e9ffd073a0301")})