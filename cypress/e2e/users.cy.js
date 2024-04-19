
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';


//public
describe('Cadastro de usuário', () => {
    let randomName;
    let randomEmail;
    
    beforeEach(() => {

        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
    })

    it('Cadastro realizado com sucesso', () => {

        cy.cadastroUsuario(randomName, randomEmail, "xuxusjk", true).then((response)=>{
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property("id");
            expect(response.body).to.have.property("email");
            expect(response.body).to.have.property("name")
        
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

    it('Cadastro não realizado - Formato de email inválido', () => {
        cy.cadastroUsuario(randomName, "jojocacom", "senha12345", false ).then((response) => {
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

    it('Cadastro não realizado - Email já cadastrado ', () => {

        cy.cadastroUsuario( randomName, randomEmail, "lwalala", true)
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

    it('Cadastro não realizado - Campo senha vazio ', () => {

        cy.cadastroUsuario( randomName, randomEmail, "", false).then((response) => {
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

        cy.cadastroUsuario( randomName, "", "senha12345", false).then((response) => {
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
})

// admin funcs
describe('Consulta usuários', () => {

    let randomName;
    let randomEmail;

    it('Listar todos usuarios com sucesso', () => {

        let token;
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        
        //steps 
        cy.cadastroUsuario( randomName, randomEmail, "lwalala", true).then((response) => {
            expect(response.status).to.equal(201)})

        cy.efetuarLogin( randomEmail, "lwalala", true).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('Object')
            expect(response.body).to.have.property('accessToken')

            token = response.body.accessToken

        cy.promoverAdministrador(token, true).then((response) => {
            expect(response.status).to.equal(204)})

        //lista todos usuarios 
            
        cy.request({
                method: 'GET',
                url: '/users',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array')

            })
        })


    })

    it('Buscar usuário pelo ID com sucesso', () => {

        let token;
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        
        //steps 
        cy.cadastroUsuario( randomName, randomEmail, "lwalala", true).then((response)=>{
            expect(response.status).to.equal(201)
        })

        cy.efetuarLogin( randomEmail, "lwalala", true).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('Object')

            token = response.body.accessToken

        cy.promoverAdministrador(token, true).then((response) => {
            expect(response.status).to.equal(204)})


        // Busca
        cy.request({
                method: 'GET',
                url: '/users/1',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200)

                // se usar um ID que não existe, o status code ainda é 200. Mas a partir dos outros testes, começa a falhar pois não tá entregando o que foi solicitado. Falta criar um retorno de erro na api para esse caso
                expect(response.body).to.be.an('Object')
                expect(response.body).to.have.property('email');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('id');
            })
        })

    })
})


//todo 


describe('Criação de review', ()=>{

})

describe('Consulta de reviews', ()=>{
    
})
