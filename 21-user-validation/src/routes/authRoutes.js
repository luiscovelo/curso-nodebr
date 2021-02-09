const Joi = require('joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')

const BaseRoute = require('./../routes/base/baseRoute')
const PasswordHelper = require('./../helpers/passwordHelper')

const USER = {
    username: 'xuxadasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute {

    constructor(secret, database){
        super()
        this._secret = secret
        this._database = database
    }

    login(){
       return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obtém um token para autenticação',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction: (request, headers, error) => {
                        throw Error(error)
                    },
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                },
                handler: async (request, headers) => {

                    const {username,password} = request.payload

                    const [usuario] = await this._database.read({
                        username: username.toLowerCase()
                    })

                    if(!usuario){
                        return Boom.unauthorized('Usuário informado não existe.')
                    }

                    const math = await PasswordHelper.comparePassword(password, usuario.password)

                    if(!math){
                        return Boom.unauthorized('Usuário ou senha inválido.')
                    }

                    const token = Jwt.sign({
                        username: username,
                        id: usuario.id
                    }, this._secret)

                    return { token }

                }
            }
        }
    }

}

module.exports = AuthRoutes