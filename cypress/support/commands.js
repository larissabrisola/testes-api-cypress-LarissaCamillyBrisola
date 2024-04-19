
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



