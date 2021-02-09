const assert = require('assert')
const api = require('../api')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

let app = {}
describe.only('Suite de teste da API Heroes', function (){

    this.beforeAll(async () => {
        app = await api
    })

    it('Listar /herois', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))

    })

    it('Listar /herois - deve retornar somente 10 registros', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === 10)

    })

    it('Listar GET - /herois - deve filtrar um item', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10&nome=Flash'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.ok(statusCode, 200)
        assert.ok(dados[0].nome === 'Flash')

    })

    it('Cadastar POST - /herois', async () =>{

        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
        })

        const statusCode = result.statusCode
        const {message,_id} = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso.")

    })

})