import { faker } from "@faker-js/faker";

describe('Consultar filme', () => {

    let baseUrl;

    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies'
    })


    it('Listar todos os filmes com sucesso', () => {
        cy.request({
            method: 'GET',
            url: baseUrl,
        }).its('status').should('to.equal', 200)
    })


    it('Pesquisar filme por ID com sucesso', () => {

        cy.request({
            method: 'GET',
            url: `${baseUrl}/19`

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.deep.equal({

                "id": 19,
                "title": "Barbie",
                "description": "O filme da Barbie e do Ken",
                "genre": "Fantasia",
                "reviews": [],
                "durationInMinutes": 135,
                "releaseYear": 2023,
                "criticScore": 0,
                "audienceScore": 0

            })
        })

    })


    it('Pesquisar filme por Titulo com sucesso', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/search?title=nobody`

        }).then((response) => {
            cy.log(response)
            expect(response.status).to.equal(200)
            
        })
    })

})