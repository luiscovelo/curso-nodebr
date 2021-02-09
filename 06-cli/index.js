const Commander = require('commander')

const database = require('./database')
const Heroi = require('./heroi')

async function main(){

    Commander
        .version('v1')
        .option('-n, --nome [value]', 'Nome do Heroi')
        .option('-p, --poder [value]', 'Poder do Heroi')
        .option('-i, --id [value]', 'ID do Heroi')

        .option('-c, --cadastrar', 'Cadastrar um Heroi')
        .option('-l, --listar', 'Listar um heroi')
        .option('-r --remover', 'Remove um heroi pelo ID')
        .option('-a, --atualizar [value]', 'Atualiza um heroi pelo ID')
        .parse(process.argv)

    const heroi = new Heroi(Commander)

    try {
        
        if(Commander.cadastrar){

            delete heroi.id

            const resultado = await database.cadastrar(heroi)
            if(!resultado){
                console.error('Heroi nao foi cadastrado')
                return
            }
            console.log('Heroi cadastrado com sucesso')
        }

        if(Commander.listar){
            const resultado = await database.listar()
            console.log(resultado)
            return
        }

        if(Commander.remover){
            const resultado = await database.remover(heroi.id)
            if(!resultado){
                console.error('Heroi nao pode ser removido')
                return
            }
            console.log('Heroi removido com sucesso')
        }

        if(Commander.atualizar){

            const idAtualizar = parseInt(Commander.atualizar)
            delete heroi.id

            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            
            const resultado = await database.atualizar(idAtualizar,heroiAtualizar)
            if(!resultado){
                console.error('Heroi nao pode ser atualizado')
                return
            }
            console.log('Heroi atualizado com sucesso')
            
        }

    } catch (error) {
        throw Error('Deu ruim', error)
    }

}

main()