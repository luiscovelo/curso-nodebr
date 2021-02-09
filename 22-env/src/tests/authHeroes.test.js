const assert = require('assert')
const api = require('./../api')

const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgres/postgres')
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')

let app = {}

const USUARIO = {
    username: 'xuxadasilva',
    password: '123'
}

const USER_DB = {
    username: USUARIO.username.toLowerCase(),
    password: '$2b$04$ayzOvG5fV25qfRpHEklkQO3KzZECl2tfjyQukbZ/FUp3pOTT7H5ea'
}

describe('Auth teste suite', function() {

    this.beforeAll(async () => {

        app = await api

        const connection = await Postgres.connect()
        const usuarioSchema = await Postgres.defineModel(connection, UsuarioSchema)
        const contextPostgres = new Context(new Postgres(connection, usuarioSchema))

        await contextPostgres.update(null, USER_DB, true)

    })

    it('Deve obter um token', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USUARIO
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.ok(dados.token.length > 10)

    })
    
    it('Deve retornar não autorizado ao tentar obter um login errado', async () => {

        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'luiscovelo',
                password: 'senhainvalida'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, 'Unauthorized')

    })

})