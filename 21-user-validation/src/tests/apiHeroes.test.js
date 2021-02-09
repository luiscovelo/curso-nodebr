const assert = require('assert')
const api = require('../api')
const { isRef } = require('joi')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Gaviao Negro',
    poder: 'A mira'
}

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU5NDQ5MTgzNX0.Ll01zFmYXOGxkBUXJd0HhopMcz8B7boga9_kEOmJBeA'

const headers = {
    authorization: JWT_TOKEN
}

let app = {}
let MOCK_HEROI_ID = ''

describe('Suite de teste da API Heroes', function (){

    this.beforeAll(async () => {

        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL),
            headers
        })

        const dados = JSON.parse(result.payload)
        MOCK_HEROI_ID = dados._id

    })

    it('Listar /herois', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10',
            headers
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))

    })

    it('Listar /herois - deve retornar somente 10 registros', async () => {

        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10',
            headers
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === 10)

    })

    it('Listar GET - /herois - deve filtrar um item', async () => {

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=10&nome=${MOCK_HEROI_INICIAL.nome}`,
            headers
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        console.log('dados', dados)

        assert.ok(statusCode, 200)
        assert.ok(dados[0].nome === MOCK_HEROI_INICIAL.nome)

    })

    it('Cadastar POST - /herois', async () =>{

        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR),
            headers
        })

        const statusCode = result.statusCode
        const {message,_id} = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso.")

    })

    it('Atualizar PATCH - /herois/:id', async () => {

        const _id = MOCK_HEROI_ID

        const expected = {
            poder: 'Fa do Batman'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected),
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso.')

    })

    it('Atualizar PATCH - /herois/:id - Não deve atualizar com ID incorreto', async () => {

        const _id = '5f08ae65d629c910b1e510ad'

        const expected = {
            poder: 'Fa do Batman'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected),
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepEqual(dados.message, 'Não foi possível atualizar')

    })

    it('Deletar DELETE - /herois/:id', async () => {

        const _id = MOCK_HEROI_ID

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi deletado com sucesso.')

    })

    it('Deletar DELETE - /herois/:id - Não deve remover com ID incorreto', async () => {

        const _id = '5f08ae65d629c910b1e510ad'

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 412)
        assert.deepEqual(dados.message, 'Não foi possível deletar')

    })

    it('Deletar DELETE - /herois/:id - Não deve remover com ID invalido', async () => {

        const _id = 'ID-INVALIDO'

        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`,
            headers
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 500)

    })

})