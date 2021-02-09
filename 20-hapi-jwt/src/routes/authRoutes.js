const BaseRoute = require('./../routes/base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')

const USER = {
    username: 'xuxadasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute {

    constructor(secret){
        super()
        this._secret = secret
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

                    if(username.toLowerCase() !== USER.username || password !== USER.password){
                        return Boom.unauthorized()
                    }

                    const token = Jwt.sign({
                        username: username,
                        id: 1
                    }, this._secret)

                    return { token }

                }
            }
        }
    }

}

module.exports = AuthRoutes