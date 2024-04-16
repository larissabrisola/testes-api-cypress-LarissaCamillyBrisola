
import { faker } from '@faker-js/faker';
        

describe('Cadastro de usuário', ()=>{

    let baseUrl;
    let randomName;
    let randomEmail; 
    
    beforeEach(()=>{
         baseUrl = 'https://raromdb-3c39614e42d4.herokuapp.com/api'

         randomName = faker.person.fullName(); // Rowan Nikolaus
         randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
    })

    it('Cadastro realizado com sucesso', ()=>{
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

    it('Cadastro não realizado - senha curta demais (deve ter de 6 a 12 caracteres)', ()=>{
        cy.request({
            method: 'POST', 
            url: `${baseUrl}/users`,
            body: {
                "name": randomName,
                "email": randomEmail,
                "password": "lwa"
              }, failOnStatusCode: false

         }).its('status').should('to.equal', 400)


         
    })

    it('Cadastro não realizado - email já cadastrado ', ()=>{
        
    })

    it('Cadastro não realizado - formato de email inválido', ()=>{
        
    })
})

describe('Login', ()=>{

    it('Login realizado com sucesso', ()=>{

    })

    it('Login não realizado - senha incorreta', ()=>{

    })

    it('Login não realizado - email não cadastrado', ()=>{

    })

    it('Login não realizado - formato de email inválido', ()=>{

    })

})

describe('Consultar usuário', ()=>{

    it('', ()=>{

    })
})