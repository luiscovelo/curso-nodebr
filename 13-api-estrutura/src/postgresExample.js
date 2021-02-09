const Sequelize = require('sequelize')
const driver = new Sequelize(
    'herois',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIndentifiers: 0,
        operatorsAliases: 0
    }
)

async function main(){

    const herois = driver.define('herois', {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'tb_herois',
        freezeTableName: false,
        timestamps: false
    })

    await herois.sync()
    await herois.create({
        nome: 'Lanterna Verde',
        poder: 'Anel'
    })

    const result = await herois.findAll({
        raw:true,
        attributes: ['id','nome','poder']
    })

}

main()
