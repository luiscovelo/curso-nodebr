const ICrud = require('./interfaces/interfaceCrud')

class Postgres extends ICrud {
    
    constructor(){
        super()
    }
    
    create(item){
        console.log('Item salvo em postgres')
    }

}

module.exports = Postgres