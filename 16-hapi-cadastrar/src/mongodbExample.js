const Mongoose = require('mongoose')

const URL_DB = 'mongodb://luiscovelo:luiscovelo@localhost:27017/herois'

const connectionState = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials'
}

Mongoose.connect(URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {

    if(error){
        console.error('Falha na conexão', error)
        return
    }

})

const connection = Mongoose.connection
connection.once('open', () => console.info('Detalhes da conexão: ', connectionState[Mongoose.connection.readyState]))

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

const model = Mongoose.model('herois', heroiSchema)

async function main(){

    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })

    const listItens = await model.find();

}

main()