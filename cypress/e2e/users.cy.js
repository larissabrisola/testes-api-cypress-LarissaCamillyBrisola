
import { faker } from '@faker-js/faker';

let baseUrl;

describe('Cadastro de usuário', () => {
    let randomName;
    let randomEmail;

    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api'

        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
    })

    it('Cadastro realizado com sucesso', () => {

        cy.log(randomEmail)
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": "lwalala"
            }

        }).its('status').should('to.equal', 201)


    })

    it('Cadastro não realizado - senha curta demais (minimo 6 caracteres)', () => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": "lwa"
            }, failOnStatusCode: false

        }).then((response) => {

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

    it('Cadastro não realizado - formato de email inválido', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": "jojocacom",
                "password": "lwalala"
            }, failOnStatusCode: false

        }).then((response) => {
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

    it('Cadastro não realizado - email já cadastrado ', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": "Luis",
                "email": "juquinha@gmail.com",
                "password": "lwalala"
            }, failOnStatusCode: false

        }).then((response) => {
            expect(response.status).to.equal(409);
            expect(response.body).to.deep.equal(
                {
                    "message": "Email already in use",
                    "error": "Conflict",
                    "statusCode": 409
                })


        })

        // add teste de campos vazios 

    })

})



describe('Login', () => {

    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login'
    })

    it('Login realizado com sucesso', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "juquinha@gmail.com",
                password: "lwalala"
            }
        }).its('status').should('to.equal', 200)
    })

    it('Login não realizado - senha incorreta', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "juquinha@gmail.com",
                password: "oioiwoi"
            }, failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                "message": "Invalid username or password.",
                "error": "Unauthorized",
                "statusCode": 401
            })
        })
    })

    it('Login não realizado - email não cadastrado', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "jbigfanavrillavigne2013@gmail.com",
                password: "oioiwoi"
            }, failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                "message": "Invalid username or password.",
                "error": "Unauthorized",
                "statusCode": 401
            })

        })
    })

    it('Login não realizado - formato de email inválido', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "jojocadom",
                password: "1234567j"
            }, failOnStatusCode: false

        }).then((response) => {

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


    it('login não realizado - campo senha vazio', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "juquinha@gmail.com",
                password: ""
            }, failOnStatusCode: false

        }).then((response) => {

            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({
                "message": [
                    "password should not be empty"
                ],
                "error": "Bad Request",
                "statusCode": 400
            })
        })
    })

    it('login não realizado - campo email vazio', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "",
                password: "aaaaaaaaw"
            }, failOnStatusCode: false

        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.deep.equal({
                "message": [
                    "email should not be empty",
                    "email must be an email"
                ],
                "error": "Bad Request",
                "statusCode": 400
            }

            )
        })
    })

})

