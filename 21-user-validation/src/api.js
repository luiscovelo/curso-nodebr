const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const Postgres = require('./db/strategies/postgres/postgres')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')

const JWT_SECRET = 'MEU_SEGREDAO_123'

const app = new Hapi.Server({
    port: 4000
})

function mapRoutes(instance, methods) {
    return methods.map( method => instance[method]() )
}

async function main(){

    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const usuarioSchema = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostres = await new Context(new Postgres(connectionPostgres, usuarioSchema))

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt','jwt', {
        key: JWT_SECRET,
        options: {
            expireIn: 5 // => minutos
        },
        validate: async (dado, request) => {

            // verifica no banco se o usuario continua ativo
            // verifica no banco se o usuario continua pagando

            const [result] = await contextPostres.read({
                username: dado.username.toLowerCase()
            })

            if(!result){
                isValid = false
            }else{
                isValid = true
            }

            return { isValid }

        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostres), AuthRoute.methods())
    ])

    await app.start()

    return app

}

module.exports = main()