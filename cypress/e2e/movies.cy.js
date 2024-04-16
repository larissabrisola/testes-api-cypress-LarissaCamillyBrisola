describe('Consultar filme', ()=>{

    
    it('Listar todos os filmes', ()=>{
        cy.request({
            method: 'GET', 
            url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies'
        }).its('status').should('to.equal', 200)
    })
    
    it('Pesquisar filme por titulo', ()=>{
        
    })


    it('Pesquisar filme por ID', ()=>{
        
    })
    
})