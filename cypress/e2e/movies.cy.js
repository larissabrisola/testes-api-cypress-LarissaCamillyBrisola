
describe('Consultar filme', () => {

    let baseUrl;

    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies'
    })


    it('Listar todos os filmes com sucesso', () => {
        cy.request({
            method: 'GET',
            url: baseUrl,
        }).then((response)=>{
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')

        })
    })


    it('Pesquisar filme por ID com sucesso', () => {

        cy.request({
            method: 'GET',
            url: `${baseUrl}/19`

        }).then((response) => {
            expect(response.status).to.equal(200)
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
            url: `${baseUrl}/search?title=nobody`

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
            // tem muito titulo repetido, infelizmente não fui capaz de entender como fazer cair em um especifico sem ser por ID, então sempre é array, nunca cai apenas naquele titulo.
        })
    })

})