
let token

describe('Cadastro de filmes', () => {

    // usar cy.commands aqui
    it('Cadastro filme - sucesso', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "xmen",
                    "genre": "desenho",
                    "description": "xmen",
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(201);
                cy.log(response)

            })
        })
    })

    it('Cadastro filme - bad request - title vazio')
    it('Cadastro filme - bad request - genre vazio')
    it('Cadastro filme - bad request - description vazio')
    it('Cadastro filme - bad request - durationMinutes vazio')
    it('Cadastro filme - bad request - releaseYear vazio')

    // 

    it('Cadastro filme - bad request - title formato inválido')
    it('Cadastro filme - bad request - genre formato inválido')
    it('Cadastro filme - bad request - description formato inválido')
    it('Cadastro filme - bad request - durationMinutes formato inválido')
    it('Cadastro filme - bad request - releaseYear formato inválido')



})


describe('Atualização de filmes', () => {
// DEPENDENTE EMOCIONAL DA INTEGRIDADE DOS DADOS DA API (SOZINHO NAO CHEGA EM LUGAR NENHUM)
    // aguardando a sessão da terapia (resposta dos instrutores)
    beforeEach(() => {
        cy.fixture('updateMovie.json').as('updateMovie');
    })
    it('Atualizar toda informação do filme sucesso', function()  {
        cy.log(this.updateMovie);
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para   
            cy.request({
                method: 'PUT',
                url: `/movies/13`,
                body: this.updateMovie,
                headers: {
                    Authorization: `${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(204);
                cy.log(response.requestBody)

            })
        })
    })
})

describe('Consultar filmes', () => {

    it('Listar todos os filmes com sucesso', () => {
        cy.request('GET', '/movies').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')

            // ta cru, depois adiciono testes
        })
    })

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

    it('Pesquisar filme por Titulo com sucesso', () => {
        cy.request({
            method: 'GET',
            url: `/movies/search?title=nobody`

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
            // ta cru, depois adiciono testes

            // nao criei caso de erro pois mesmo colocando um titulo que nao existe, a api retorna 200 pois a chamada foi feita
        })
    })

})

