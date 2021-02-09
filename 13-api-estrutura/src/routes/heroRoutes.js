const BaseRoute = require('./../routes/base/baseRoute')

class HeroRoutes extends BaseRoute {

    constructor(database){
        super()
        this._database = database
    }

    list(){
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                return this._database.read()
            }
        }
    }

}

module.exports = HeroRoutes