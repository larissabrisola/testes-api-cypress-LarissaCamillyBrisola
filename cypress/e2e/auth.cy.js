import { faker } from "@faker-js/faker";


describe('Login', () => {
    let baseUrl;
    let randomEmail;
    let randomName;
    
    beforeEach(() => {
        baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login'
        randomEmail = faker.internet.email();
        randomName = faker.person.fullName();

    })

    it('Login realizado com sucesso', () => {

        //cadastro valido
        cy.cadastroUsuario( randomName, randomEmail, "lwalala", true).then((response)=>{
            expect(response.status).to.equal(201)
        })

        // login do cadastro realizado acima
        cy.efetuarLogin( randomEmail, "lwalala", true ).then((response)=>{
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('Object')
            expect(response.body).to.have.property('accessToken')
        })

    })

    it('Login não realizado - senha inválida', () => {
        cy.efetuarLogin(randomEmail, "oui", false).then((response) => {
            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                "message": "Invalid username or password.",
                "error": "Unauthorized",
                "statusCode": 401
            })
        })
    })

    it('Login não realizado - email não cadastrado', () => {
        cy.efetuarLogin("jbigfanavrillavigne2013@gmail.com", "oioiwoi", false).then((response) => {
            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal({
                "message": "Invalid username or password.",
                "error": "Unauthorized",
                "statusCode": 401
            })

        })
    })

    it('Login não realizado - formato de email inválido', () => {
        cy.efetuarLogin( "jojocadom", "1234567j", false).then((response) => {
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
        cy.efetuarLogin("juquinha@gmail.com", "", false).then((response) => {
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
        cy.efetuarLogin("", "aaaaaaaaw", false).then((response) => {
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

