const ICrud = require('./../interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const URL_DB = process.env.MONGO_DB_URL.toString()

const connectionState = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials'
}

class MongoDB extends ICrud {

    constructor(connection, schema){
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected(){

        const state = this._connection.readyState

        if(state === 1){
            return state
        }

        if(state !== 1){
            await this._connection.once('connected', () => {
                return this._connection
            })
        }

        return this._connection.readyState

    }

    static connect(){

        Mongoose.connect(URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error) => {
        
            if(error){
                console.error('Falha na conexão', error)
                return
            }
        
        })

        this._connection = Mongoose.connection
        this._connection.once('open', () => console.info('Detalhes da conexão: ', connectionState[this._connection.readyState]))

        return this._connection

    }

    async create(item){
        return await this._schema.create(item)
    }

    async read(query = {}, skip = 0, limit = 10){
        return await this._schema.find(query).skip(skip).limit(limit)
    }

    async update(id, item){
        return await this._schema.updateOne({ _id: id }, {$set: item})
    }

    async delete(id){
        return await this._schema.deleteOne({ _id: id })
    }

}

module.exports = MongoDB