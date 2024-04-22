
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
            expect(response.body).to.deep.equal( {
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
            expect(response.body).to.deep.equal( {
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

    before(function(){
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        cy.cadastroUsuario(randomName, randomEmail, "senha1234", true).then((response)=>{
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

    it('criar review com sucesso', ()=>{
        
    })
    // o filme precisa existir 
        // criar filme // funcao do adm 
        // pegar id (??)- so se descobre sendo adm 
    // criar review // usuario 

})

// usuario comum
describe('Consulta de reviews', () => {
    it('Listar todos reviews do usuario logado com sucesso', () => {

        // pra isso precisa ter um filme 
        // pra isso ele precisa pegar o id do filme - e como usuario comum nao da 
        // pra dai poder avaliar 
        // pra dai poder listar o que fez

        
        // ou so fazer a listagem mesmo vazia ???

        cy.perfilComum(true).then((response) => {
            token = response.body.accessToken

            cy.log(token)
            
            cy.request({
                method: 'GET',
                url: '/users/review/all', 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array')

            })
        })
    })
})


// nao to gostando da organização do código, depois de terminar a atividade, refatorar 