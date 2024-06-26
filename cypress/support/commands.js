import { faker } from "@faker-js/faker"



// usuários 
Cypress.Commands.add('cadastroUsuario', (name, email, password, failOnStatusCode)=>{
   cy.request( 
        {method:'POST', url: `/users`,
         body: {
            "name": name,
           "email": email,
            "password": password
        }, failOnStatusCode: failOnStatusCode}
)
})

Cypress.Commands.add('efetuarLogin', (email, password, failOnStatusCode)=>{

    cy.request({
        method: 'POST', url: `/auth/login`, body: {
            "email": email, 
            "password": password
        }, failOnStatusCode: failOnStatusCode
    })
})

Cypress.Commands.add('promoverAdministrador', (token, failOnStatusCode)=>{

    cy.request({
        method: 'PATCH',
        url: `/users/admin`,
        headers: {
            Authorization: `Bearer ${token}`
        }, failOnStatusCode: failOnStatusCode
    })
})


Cypress.Commands.add('perfilAdm', (failOnStatusCode)=>{

    let randomName;
    let randomEmail;
    let email
    let password 

    let token
    randomName = faker.person.fullName();
    randomEmail = faker.internet.email();
    
// cadastro valido de usuario 
    cy.cadastroUsuario(randomName, randomEmail, "senha12345", true).then((response)=>{
    email = response.body.email;
    password = 'senha12345'
    // login 
        cy.efetuarLogin( email,  password, true ).then((response)=>{
            token = response.body.accessToken
        // promovendo usuario a admin
            cy.promoverAdministrador(token, true).then((response)=>{
                expect(response.status).to.equal(204)
        })
    })
})
})

Cypress.Commands.add('perfilComum', (failOnStatusCode)=>{
    

    let randomName;
    let randomEmail;
    let email
    let password 

    let token
    randomName = faker.person.fullName();
    randomEmail = faker.internet.email();
    
// cadastro valido de usuario 
    cy.cadastroUsuario(randomName, randomEmail, "senha12345", true).then((response)=>{
    email = response.body.email;
    password = 'senha12345'
        //login  
        cy.efetuarLogin( email,  password, true ).then((response)=>{
            token = response.body.accessToken
})
})


})

// filme 

Cypress.Commands.add('cadastrarFilme', function (){
    cy.fixture('filmeParaCadastro.json').as('cadastroFilme')
    let token
    cy.perfilAdm(true).then((response) => {
        token = response.requestHeaders.Authorization
        //lista       
        cy.request({
            method: 'POST',
            url: '/movies',
            headers: {
                Authorization: `${token}`
            }, 
            body: this.cadastroFilme
        }).then((response) => {
                expect(response.status).to.equal(201);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('title')
                expect(response.body).to.have.property('description')
                expect(response.body).to.have.property('durationInMinutes')
                expect(response.body).to.have.property('releaseYear')
                expect(response.body).to.have.property('genre')
        })
    })
})

Cypress.Commands.add('deletarFilme', function(movieId){
    let token

    cy.perfilAdm(true).then((response)=>{
        token = response.requestHeaders.Authorization

        cy.request({
            method: 'DELETE', 
            url: '/movies/' + movieId, 
            headers: {
                Authorization: `${token}`
            }
        })
    })
})
