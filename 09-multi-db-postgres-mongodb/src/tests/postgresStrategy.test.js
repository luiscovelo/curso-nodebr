const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')
const { deepEqual } = require('assert')
const { connect } = require('http2')

const context = new Context(new Postgres())

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'Mira Absurda'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

describe('Postgres Strategy', function () {

    this.timeout(Infinity)

    before( async () => {
        await context.connect()
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
    })

    it('PostgresSQL Connection', async () => {

        const result = await context.isConnected()
        assert.equal(result,true)

    })

    it('Cadastrar um heroi', async () => {

        const result = await context.create(MOCK_HEROI_CADASTRAR)

        if(result){
            delete result.id
        }

        deepEqual(result, MOCK_HEROI_CADASTRAR)

    })

    it('Listar herois', async () => {

        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })

        if(result){
            delete result.id 
        }

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)

    })

    it('Atualizar um heroi', async () => {

        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome })

        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }

        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id})
        
        assert.deepEqual(result, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)

    })

    it('Remover um heroi por id', async () => {

        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepEqual(result, 1)

    })

})