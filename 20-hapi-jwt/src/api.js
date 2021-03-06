const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')

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
    const context = new Context(new MongoDB(connection,HeroiSchema))

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
        // options: {
        //     expireIn: 20
        // }
        validate: (dado, request) => {
            // verifica no banco se o usuario continua ativo
            // verifica no banco se o usuario continua pagando

            return {
                isValid: true
            }

        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
    ])

    await app.start()

    return app

}

module.exports = main()