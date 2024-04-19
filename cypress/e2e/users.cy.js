
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let baseUrl;

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
    baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api'


    it('Listar todos usuarios', () => {

        let token;
        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
        // cadastro usuario 
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": "lwalala"
            }

        }).then((response) => {
            expect(response.status).to.equal(201)

        })

        
        // login de usuario 
        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login',
            body: {
                email: randomEmail,
                password: "lwalala"
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('Object')
            expect(response.body).to.have.property('accessToken')

            token = response.body.accessToken

            // promove usuario a admin 
            cy.request({
                method: 'PATCH',
                url: `${baseUrl}/users/admin`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(204)
            })


            //lista todos usuarios 
            
            cy.request({
                method: 'GET',
                url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.an('array')

            })

            // busca usuario por id 
            cy.request({ 
                method: 'GET',
                url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/1',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.an('Object')
                expect(response.body).to.have.property('email');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('id');
            })
        })


    })


})

    // aprimoramentos futuros: 
        // consulta de usuarios + fixtures
        // reduzir codigo no arquivo usando cy.commands
        //  delete user 
        // update user id 
        // promote user to critic
        // promote user to admin 
