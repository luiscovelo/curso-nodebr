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
                        throw Error(error)
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(0).max(100).default({})
                    }
                }
            },
            handler: (request, headers) => {

                try {
                    
                    const {skip, limit, nome} = request.query
                    const query = nome ? {nome: {$regex: `.*${nome}*.`} } : {}
                    
                    return this._database.read(query, skip, limit)

                } catch (error) {
                    console.error('Erro interno', error)
                }
            }
        }
    }

}

module.exports = HeroRoutes