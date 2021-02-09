const assert = require('assert')
const PasswordHelper = require('./../helpers/passwordHelper')

const SENHA = 'LuisFelipeCovelo'
const HASH = '$2b$04$QvUEmtcKGzdPIYHn.2WuL.CsUqASiKg9GSMGbvtU.aceU8lJNNt0q'

describe('UserHelper teste suite', function() {

    it('Deve gerar um hash a partir de uma senha', async () => {

        const result = await PasswordHelper.hashPassword(SENHA)

        assert.ok(result.length > 10)

    })

    it('Deve validar a senha', async () => {

        const result = await PasswordHelper.comparePassword(SENHA,HASH)

        assert.ok(result)

    })

})