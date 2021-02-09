const BaseRoute = require('./../routes/base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')

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
                tags: ['api'],
                description: 'Deve listar herois',
                notes: 'Pode paginar os resultados e filtrar por nome',
                validate: {
                    failAction: (request, headers, error) => {
                        throw Error(error)
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(0).max(100)
                    }
                }
            },
            handler: (request, headers) => {

                try {
                    
                    const {skip, limit, nome} = request.query
                    const query = nome ? {nome: {$regex: `.*${nome}*.`} } : {}
                    
                    return this._database.read(query, skip, limit)

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    create(){
       return {
           path: '/herois',
           method: 'POST',
           config: {
                tags: ['api'],
                description: 'Deve criar um heroi',
                validate: {
                    failAction: (request, headers, error) => {
                        throw Error(error)
                    },
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                   }
                }
           },
           handler: async (request, headers) => {

                try {
                   
                    const {nome,poder} = request.payload
                    const result = await this._database.create({nome,poder})

                    return { 
                        message: 'Heroi cadastrado com sucesso.',
                        _id: result._id
                    }

                } catch (error) {
                    return Boom.internal()
                }

            }
        }    
    }

    update(){
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Deve atualizar um heroi pelo ID',
                notes: 'A atualização permite alteração total ou parcialmente as informações do heroi.',
                validate: {
                    failAction: (request, headers, error) => {
                        throw Error(error)
                    },
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: async (request, headers) => {
                
                try {
                    
                    const {id} = request.params
                    const {payload} = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this._database.update(id, dados)

                    if(result.nModified !== 1) return Boom.preconditionFailed('Não foi possível atualizar')

                    return {
                        message: 'Heroi atualizado com sucesso.'
                    }

                } catch (error) {
                    return Boom.internal()
                }

            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deve remover um heroi pelo ID',
                validate: {
                    failAction: (request, headers, error) => {
                        throw Error(error)
                    },
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {

                try {
                    
                    const {id} = request.params
                    const result = await this._database.delete(id)

                    if(result.deletedCount === 0 || result.ok !== 1) return Boom.preconditionFailed('Não foi possível deletar')

                    return {
                        message: 'Heroi deletado com sucesso.'
                    }

                } catch (error) {
                    return Boom.internal()
                }

            }
        }
    }

}

module.exports = HeroRoutes