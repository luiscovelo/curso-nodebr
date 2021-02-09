const http = require('http')

http.createServer((req,res) => {
    res.end('Hello')
})
.listen(4000, () => console.log('Servidor rodando...'))