import { faker } from "@faker-js/faker";


describe('Login', () => {
    let baseUrl;
    let randomEmail;
    
    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login'
    })

    it('Login realizado com sucesso', () => {

        randomEmail = faker.internet.email();


        //cadastro valido
        cy.request({
            method: 'POST',
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
            body: {
                "name": "jujuco",
                "email": randomEmail,
                "password": "lwalala"
        }})

        // login do cadastro realizado acima

        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: randomEmail,
                password: "lwalala"
            }
        }).then((response)=>{
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('Object')
            expect(response.body).to.have.property('accessToken')

        })

        //then((response)=>{expect.... to.have.property
    })

    it('Login não realizado - senha incorreta/curta', () => {
        cy.request({
            method: 'POST',
            url: baseUrl,
            body: {
                email: "juquinha@gmail.com",
                password: "oio"
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


    it('Login não realizado - campo senha vazio', () => {
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

    it('Login não realizado - campo email vazio', () => {
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

