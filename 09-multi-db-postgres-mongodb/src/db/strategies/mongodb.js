const ICrud = require('./interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const URL_DB = 'mongodb://luiscovelo:luiscovelo@localhost:27017/herois'

const connectionState = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials'
}

class MongoDB extends ICrud {

    constructor(){
        super()
        this._herois = null
        this._driver = null
    }

    async isConnected(){

        const state = this._driver.readyState

        if(state === 1){
            return state
        }

        if(state !== 1){
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        return this._driver.readyState

    }

    connect(){

        Mongoose.connect(URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error) => {
        
            if(error){
                console.error('Falha na conexão', error)
                return
            }
        
        })

        this._driver = Mongoose.connection
        this._driver.once('open', () => console.info('Detalhes da conexão: ', connectionState[this._driver.readyState]))
        this.defineModel()

    }

    defineModel(){

       const heroiSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        })

        this._herois = Mongoose.model('herois', heroiSchema)

    }

    async create(item){
        return await this._herois.create(item)
    }

    async read(query = {}, skip = 0, limit = 10){
        return await this._herois.find(query).skip(skip).limit(limit)
    }

    async update(id, item){
        return await this._herois.updateOne({ _id: id }, {$set: item})
    }

    async delete(id){
        return await this._herois.deleteOne({ _id: id })
    }

}

module.exports = MongoDB