const BaseRoute = require('./../routes/base/baseRoute')
const Joi = require('joi')

class HeroRoutes extends BaseRoute {

    constructor(database){
        super()
        this._database = database
    }

    list(){
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, headers, error) => {
                        throw error
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {

                try {
                    
                    const {skip, limit, nome} = request.query

                    let query = {}

                    if(nome){
                        query.nome = nome
                    }
                    
                    return this._database.read(query, parseInt(skip), parseInt(limit))

                } catch (error) {
                    console.error('Erro interno', error)
                }
            }
        }
    }

}

module.exports = HeroRoutes