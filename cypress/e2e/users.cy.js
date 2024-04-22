
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let token
let userId
let randomName;
let randomEmail;

describe('Cadastro de usuário', () => {
    beforeEach(() => {
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
    })

    it('Cadastro realizado com sucesso', () => {

        cy.cadastroUsuario(randomName, randomEmail, "xuxusjk", true).then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property("id");
            expect(response.body).to.have.property("email");
            expect(response.body).to.have.property("name")

        })
    })
    it('Cadastro não realizado - Campo senha vazio ', () => {

        cy.cadastroUsuario(randomName, randomEmail, "", false).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body).to.deep.equal({
                "message": [
                    "password must be longer than or equal to 6 characters",
                    "password should not be empty"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })
    })
    it('Cadastro não realizado - Campo email vazio ', () => {

        cy.cadastroUsuario(randomName, "", "senha12345", false).then((response) => {
            expect(response.status).to.equal(400);

            expect(response.body).to.deep.equal({
                "message": [
                    "email must be longer than or equal to 1 characters",
                    "email must be an email",
                    "email should not be empty"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })


    })
    it('Cadastro não realizado - Campo name vazio ', () => {

        cy.cadastroUsuario('', randomEmail, "senha12345", false).then((response) => {
            expect(response.status).to.equal(400);

            expect(response.body).to.deep.equal({
                "message": [
                    "name must be longer than or equal to 1 characters",
                    "name should not be empty"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })


    })
    it('Cadastro não realizado - Todos os campos vazios ', () => {

        cy.cadastroUsuario("", "", "", false).then((response) => {
            expect(response.status).to.equal(400);

            expect(response.body).to.deep.equal({
                "message": [
                    "name must be longer than or equal to 1 characters",
                    "name should not be empty",
                    "email must be longer than or equal to 1 characters",
                    "email must be an email",
                    "email should not be empty",
                    "password must be longer than or equal to 6 characters",
                    "password should not be empty"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })


    })
    it('Cadastro não realizado - Senha curta demais (minimo 6 caracteres)', () => {

        cy.cadastroUsuario(randomName, randomEmail, "oui", false).then((response) => {

            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({
                "message": [
                    "password must be longer than or equal to 6 characters"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })

    })
    it('Cadastro não realizado - Formato de senha inválido (minimo 6 caracteres)', () => {

        cy.cadastroUsuario(randomName, randomEmail, 1234, false).then((response) => {

            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({
                "message": [
                    "password must be longer than or equal to 6 and shorter than or equal to 12 characters",
                    "password must be a string"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })

    })
    it('Cadastro não realizado - Formato de email inválido', () => {
        cy.cadastroUsuario(randomName, "jojocacom", "senha12345", false).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({
                "message": [
                    "email must be an email"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })

        })
    })
    it('Cadastro não realizado - Formato de name inválido', () => {
        cy.cadastroUsuario(123, randomEmail, "senha12345", false).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({
                "message": [
                    "name must be longer than or equal to 1 and shorter than or equal to 100 characters",
                    "name must be a string"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })

        })
    })
    it('Cadastro não realizado - Email já cadastrado ', () => {

        cy.cadastroUsuario(randomName, randomEmail, "lwalala", true)
        // reutilizando o mesmo email acima 
        cy.cadastroUsuario(randomName, randomEmail, "lwalala", false).then((response) => {

            expect(response.status).to.equal(409);
            expect(response.body).to.deep.equal(
                {
                    "message": "Email already in use",
                    "error": "Conflict",
                    "statusCode": 409
                })
        })
    })
})
// admin funcs
describe('Consulta usuários', () => {

    before(function () {
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        cy.cadastroUsuario(randomName, randomEmail, "senha1234", true).then((response) => {
            userId = response.body.id
        })
    })

    it('Buscar usuário pelo ID com sucesso', () => {

        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization

            // busca
            cy.request({
                method: 'GET',
                url: '/users/' + userId,
                headers: {
                    Authorization: `${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200)

                // se usar um ID que não existe, o status code ainda é 200. Mas a partir dos outros testes, começa a falhar pois não tá entregando o que foi solicitado. Falta criar um retorno de erro na api para esse caso
                expect(response.body).to.be.an('Object')
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('email');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('type');
                expect(response.body).to.have.property('active');

            })
        })
    })

    it('Listar todos usuarios com sucesso', () => {

        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            //lista       
            cy.request({
                method: 'GET',
                url: '/users',
                headers: {
                    Authorization: `${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array')

            })
        })
    })


})

// usuario comum can
describe('Criação de review', () => {

    let movieId

    before(() => {
        cy.cadastrarFilme().then((response) => {
            movieId = response.body.id
        })
    })
    it('criar review com sucesso', () => {
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": 3,
                    "reviewText": "lorem ipsum"
                }
            })
        })
    })
    it('criar review com sucesso apenas com textReview vazio', () => {
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": 3,
                    "reviewText": ''
                }, failOnStatusCode: true
            }).then((response)=>{
                expect(response.status).to.equal(201)
            })
        })
    })
    it('criar review - bad request - id vazio', () => {

        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": '',
                    "score": 3,
                    "reviewText": "lorem ipsum"
                }, failOnStatusCode: false
            }).then((response)=>{
                expect(response.status).to.equal(400)
                expect(response.body).to.deep.equal( {
                    "message": [
                    "movieId must be an integer number",
                    "movieId should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                    })
            })
        })
    })
    it('criar review - bad request - score vazio', () => {

        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": '',
                    "reviewText": "lorem ipsum"
                }, failOnStatusCode: false
            }).then((response)=>{
                expect(response.status).to.equal(400)
                expect(response.body).to.deep.equal( {
                    "message": [
                    "score must be a number conforming to the specified constraints",
                    "score should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                    })
            })
        })
    })
    it('criar review - bad request - reviewText formato inválido', () => {
        // review vazio funciona
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": 3,
                    "reviewText": 234,
                }, failOnStatusCode: false
            }).then((response)=>{
                expect(response.status).to.equal(400)
                expect(response.body).to.deep.equal( {
                    "message": [
                    "reviewText must be a string"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                    })
            })
        })
    })
    it('criar review - bad request - todos campos vazios', () => {
        // review vazio funciona
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": '',
                    "score": '',
                    "reviewText": '',
                }, failOnStatusCode: false
            }).then((response)=>{
                expect(response.status).to.equal(400)
                expect(response.body).to.deep.equal({
                    "message": [
                    "movieId must be an integer number",
                    "movieId should not be empty",
                    "score must be a number conforming to the specified constraints",
                    "score should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                    })
            })
        })
    })
    it('criar review - bad request - score só pode receber os valores 1,2,3,4,5', () => {
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": 6,
                    "reviewText": "lorem ipsum"
                }, failOnStatusCode: false
            }).then((response)=>{
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": "Score should be between 1 and 5",
                    "error": "Bad Request",
                    "statusCode": 400
                    })
            })
        })
    })

})


// usuario comum
describe('Consulta de reviews', () => {
    it('Listar todos reviews do usuario logado com sucesso', () => {
        
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'GET',
                url: '/users/review/all',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array')
                // esse usuario nunca criou review pois ele acabou de nascer entao vai ser array vaziokkkmas ta retornandooo

            })
        })
    })
})


describe('Manutenção de contas - admin', ()=>{

    before(function () {

        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        cy.cadastroUsuario(randomName, randomEmail, "senha1234", true).then((response) => {
            userId = response.body.id
        })
    })

    it('Deletar usuario com sucesso', ()=>{
        
        cy.perfilAdm(true).then((response)=>{
            token = response.requestHeaders.Authorization
    
    
            cy.request({
                method: 'DELETE', 
                url: '/users/' + userId, 
                headers: {
                    Authorization: `${token}`
                }
            }).then((response)=>{
                expect(response.status).to.equal(204)
            })
    
        })
    })

    it('Atualizar informações do usuario com sucesso', ()=>{
        cy.fixture('userUpdate').as('userUpdate')

        cy.perfilAdm(true).then(function(response){
            token = response.requestHeaders.Authorization
    
    
            cy.request({
                method: 'PUT', 
                url: '/users/' + userId, 
                headers: {
                    Authorization: `${token}`
                }, 
                body: this.userUpdate, 
            }).then((response)=>{
                expect(response.status).to.equal(200)
            })
    
        })
    })


})


describe('Manutenção de conta - usuario comum', ()=>{


    beforeEach(function () {
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        cy.cadastroUsuario(randomName, randomEmail, "senha1234", true).then((response) => {
            userId = response.body.id
        })
    })


    it('Inativar minha conta com sucesso', ()=>{
        cy.perfilComum(true).then((response)=>{
            token = response.body.accessToken
    
    
            cy.request({
                method: 'PATCH', 
                url: '/users/inactivate', 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response)=>{
                expect(response.status).to.equal(204)
            })
    
        })
    })

    it('Atualizar minhas informações com sucesso', ()=>{

        cy.efetuarLogin(randomEmail, "senha1234", true).then(function(response){
            
            token = response.body.accessToken

            cy.request({
                method: 'PUT', 
                url: '/users/' + userId, 
                headers: {
                    Authorization: `Bearer ${token}`
                }, 
                body: {
                    "name": "Caio",
                    "password": "senha12345"
                }, 
            }).then((response)=>{
                expect(response.status).to.equal(200)
            })
    
        })
    })

})

// usuario comum 
describe('Atualizar review', ()=>{
    let movieId
    before(()=>{
        cy.cadastrarFilme().then((response) => {
            movieId = response.body.id
        })

        // criando review pro filme
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": 3,
                    "reviewText": "lorem ipsum"
                }
            })
        })
        // quando for fazer a review no mesmo filme, ele vai atualizar pois só pode um review por filme
        })

      it('Atualizar Review com sucesso', ()=>{
        // só pode ter uma review por filme, então substitui a review anterior
        // sem cenario de erro pois o caminho é o mesmo de criação, dai já tem acima 
        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    "movieId": movieId,
                    "score": 4,
                    "reviewText": "loremssssssssssssss ipsum"
                }
            }).then((response)=>{
                expect(response.status).to.equal(201);
            })
        })
      })
    })

// nao to gostando da organização do código, depois de terminar a atividade, refatorar 