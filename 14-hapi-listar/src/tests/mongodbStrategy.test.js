const assert = require('assert')
const MongoDB = require('../db/strategies/mongodb/mongodb')
const Context = require('../db/strategies/base/contextStrategy')
const { deepEqual } = require('assert')

const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')

const MOCK_CADASTRAR_HEROI = {
    nome: 'Robin',
    poder: 'Fa do Batman'
}

const MOCK_DEFAULT_HEROI = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Teia'
}

const MOCK_ATUALIZAR_HEROI = {
    nome: 'Patolino',
    poder: 'Velocidade'
}

let MOCK_HEROI_ID = null

let context = {}

describe('MongoBD Suite de Testes', () => {

    before(async () => {
        
        const connection = MongoDB.connect()

        context = new Context(new MongoDB(connection,HeroiSchema))

        await context.create(MOCK_DEFAULT_HEROI)

        const result = await context.create(MOCK_ATUALIZAR_HEROI)
        MOCK_HEROI_ID = result._id

    })

    it('Verificar conexão', async () => {

        const result = await context.isConnected()
        assert.deepEqual(result,1)

    })

    it('Cadastrar um heroi', async () => {

        const { nome, poder } = await context.create(MOCK_CADASTRAR_HEROI)

        assert.deepEqual({nome,poder}, MOCK_CADASTRAR_HEROI)

    })

    it('Listar herois', async () => {

        const [{nome,poder}] = await context.read({nome: MOCK_DEFAULT_HEROI.nome})
        const result = {
            nome,
            poder
        }

        assert.deepEqual(result, MOCK_DEFAULT_HEROI)

    })

    it('Atualizar um heroi', async () => {

        const result = await context.update(MOCK_HEROI_ID, {nome: 'Perna loga'})
        assert.deepEqual(result.nModified, 1)

    })

    it('Remover um herou por ID', async () => {

        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.n, 1)

    })

})