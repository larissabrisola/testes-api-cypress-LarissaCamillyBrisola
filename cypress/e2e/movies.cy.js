describe('Cadastro de filmes', ()=>{
    
})

describe('Atualização de filmes', ()=>{
    
})


//done
describe('Consultar filmes', () => {

    //public
    it('Listar todos os filmes com sucesso', () => {
        cy.request('GET', '/movies').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')

        })
    })

    //public
    it('Pesquisar filme por ID com sucesso', () => {

        cy.request({
            method: 'GET',
            url: `/movies/19`

        }).then((response) => {
            expect(response.status).to.equal(200)

            // se usar um ID que não existe, o status code ainda é 200. Mas a partir dos outros testes, começa a falhar pois não tá entregando o que foi solicitado. Falta criar um retorno de erro na api para esse caso
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('title')
            expect(response.body).to.have.property('genre')
            expect(response.body).to.have.property('description')
            expect(response.body).to.have.property('durationInMinutes')
            expect(response.body).to.have.property('releaseYear')

        })

    })

    //public
    it('Pesquisar filme por Titulo com sucesso', () => {
        cy.request({
            method: 'GET',
            url: `/movies/search?title=nobody`

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
            // nao criei caso de erro pois mesmo colocando um titulo que nao existe, a api retorna 200 pois a chamada foi feita
        })
    })

})

