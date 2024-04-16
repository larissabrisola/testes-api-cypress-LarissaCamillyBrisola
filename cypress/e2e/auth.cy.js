
describe('Login', () => {
    let baseUrl;


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

