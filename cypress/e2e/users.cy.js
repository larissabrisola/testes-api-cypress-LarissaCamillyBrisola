
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let token

//public
describe('Cadastro de usuário', () => {
    let randomName;
    let randomEmail;

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
    
    it('Cadastro não realizado - todos os campos estão vazios ', () => {

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
    
})

// admin funcs
describe('Consulta usuários', () => {

    it('Listar todos usuarios com sucesso', () => {

        //steps
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

    it('Buscar usuário pelo ID com sucesso', () => {

        //steps
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization

            // busca
            cy.request({
                method: 'GET',
                url: '/users/1',
                headers: {
                    Authorization: `${token}`
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


describe('Criação de review', () => {
    // criar filme 
    // pegar id (mas ele nao retorna response body??)

})

describe('Consulta de reviews', () => {

})




// nao to gostando da organização do código, depois de terminar a atividade, refatorar 