const ICrud = require('./interfaces/interfaceCrud')

class MongoDB extends ICrud {
    constructor(){
        super()
    }

    create(item){
        console.log('Item salvo em mongodb')
    }

}

module.exports = MongoDB