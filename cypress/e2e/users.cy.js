
import { faker } from '@faker-js/faker';

let baseUrl;

//public
describe('Cadastro de usuário', () => {
    let randomName;
    let randomEmail;

    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api'

        randomName = faker.person.fullName();
        randomEmail = faker.internet.email();
    })

    it('Cadastro realizado com sucesso', () => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": "lwalala"
            }

        }).then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('email');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('id');

        })




    })

    it('Cadastro não realizado - Senha curta demais (minimo 6 caracteres)', () => {

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

    it('Cadastro não realizado - Formato de email inválido', () => {
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

    it('Cadastro não realizado - Email já cadastrado ', () => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": "lwalala"
            }

        })

        // reutilizando o mesmo email acima 
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
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

    })

    it('Cadastro não realizado - Campo senha vazio ', () => {

        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": ""
            }, failOnStatusCode: false


        }).then((response) => {
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

        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": "",
                "password": "aaawsder"
            }, failOnStatusCode: false

        }).then((response) => {
            expect(response.status).to.equal(400)

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
    //steps 
    let randomName;
    let randomEmail;
    baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api'


    it('surto', () => {

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

        })
        // loga usuario

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

            token = response.body.acessToken 

            cy.log(token)
        })


    

    })

    // promove usuario a admin 





    // list users 
    // find user by id 
    // delete user 
    // update user id 
    // promote user to critic
    // promote user to admin 





})
