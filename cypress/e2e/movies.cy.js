import { faker } from "@faker-js/faker";

let token

//admin funcs
describe('Cadastro de filmes', () => {
    let movieId;
    after(() => {
        cy.deletarFilme(movieId)
    })
    it('Cadastro filme - sucesso', function () {
        cy.fixture('filmeParaCadastro').as('cadastroFilme')

        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: this.cadastroFilme,
                headers: {
                    Authorization: `${token}`
                }
            }).then((response) => {
                movieId = response.body.id
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

    it('Cadastro filme - bad request - title vazio', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "",
                    "genre": "desenho",
                    "description": "xmen",
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "title must be longer than or equal to 1 characters",
                        "title should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - genre vazio', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "xuxa",
                    "genre": "",
                    "description": "xmen",
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "genre must be longer than or equal to 1 characters",
                        "genre should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - description vazio', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "lua de cristal",
                    "genre": "desenho",
                    "description": "",
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "description must be longer than or equal to 1 characters",
                        "description should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - durationMinutes vazio', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "Bola",
                    "genre": "desenho",
                    "description": "xmen",
                    "durationInMinutes": '',
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal(
                    {
                        "message": [
                            "durationInMinutes must be a number conforming to the specified constraints",
                            "durationInMinutes should not be empty"
                        ],
                        "error": "Bad Request",
                        "statusCode": 400
                    }
                )
            })
        })
    })
    it('Cadastro filme - bad request - releaseYear vazio', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "Matrix",
                    "genre": "desenho",
                    "description": "xmen",
                    "durationInMinutes": 120,
                    "releaseYear": ''
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "releaseYear must be a number conforming to the specified constraints",
                        "releaseYear should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - todos os campos vazios', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization

            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "",
                    "genre": "",
                    "description": "",
                    "durationInMinutes": '',
                    "releaseYear": ''
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "title must be longer than or equal to 1 characters",
                        "title should not be empty",
                        "genre must be longer than or equal to 1 characters",
                        "genre should not be empty",
                        "description must be longer than or equal to 1 characters",
                        "description should not be empty",
                        "durationInMinutes must be a number conforming to the specified constraints",
                        "durationInMinutes should not be empty",
                        "releaseYear must be a number conforming to the specified constraints",
                        "releaseYear should not be empty"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    // 

    it('Cadastro filme - bad request - title formato inválido', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": 123,
                    "genre": "desenho",
                    "description": "xmen",
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "title must be longer than or equal to 1 and shorter than or equal to 100 characters",
                        "title must be a string"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - genre formato inválido', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "moranguinho",
                    "genre": 1243,
                    "description": "xmen",
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "genre must be longer than or equal to 1 and shorter than or equal to 100 characters",
                        "genre must be a string"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - description formato inválido', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "Sailor moon",
                    "genre": "desenho",
                    "description": 123,
                    "durationInMinutes": 120,
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "description must be longer than or equal to 1 and shorter than or equal to 500 characters",
                        "description must be a string"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - durationMinutes formato inválido', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "Sailor moon",
                    "genre": "desenho",
                    "description": "oiiiiiiiiiiiii",
                    "durationInMinutes": '120',
                    "releaseYear": 2007
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "durationInMinutes must be a number conforming to the specified constraints"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
    it('Cadastro filme - bad request - releaseYear formato inválido', () => {
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization
            // procurar api para randomizar
            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": "Sailor moon",
                    "genre": "desenho",
                    "description": "lorem ipsum dolor sit amet",
                    "durationInMinutes": 120,
                    "releaseYear": '2007'
                },
                headers: {
                    Authorization: `${token}`
                }, failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.deep.equal({
                    "message": [
                        "releaseYear must be a number conforming to the specified constraints"
                    ],
                    "error": "Bad Request",
                    "statusCode": 400
                })

            })
        })
    })
})

//admin funcs
describe('Atualização de filmes', () => {
    let movieId

    before(() => {
        cy.cadastrarFilme().then((response) => {
            movieId = response.body.id
            cy.log(response.body)
        })
    })

    after(() => {
        cy.deletarFilme(movieId)
    })

    it('Atualizar filme com sucesso', function () {
        cy.fixture('updateMovie').as('updateMovie')

        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization

            cy.request({
                method: 'PUT',
                url: '/movies/' + movieId,
                body: this.updateMovie,
                headers: {
                    Authorization: ` ${token}`
                }
            })
        })
    })
})


// public
describe('Consultar filmes', () => {
    let movieId
    let movieTitle

    let movieDescription
    let movieDuration
    let movieGenre
    let movieRelease

    //cadastrar filme
    before(() => {
        movieTitle = faker.company.name()
        movieGenre = faker.company.name()
        movieDescription = faker.company.name()
        movieDuration = 20;
        movieRelease = 2000
        cy.perfilAdm(true).then((response) => {
            token = response.requestHeaders.Authorization

            cy.request({
                method: 'POST',
                url: `/movies`,
                body: {
                    "title": movieTitle,
                    "genre": movieGenre,
                    "description": movieDescription,
                    "durationInMinutes":movieDuration,
                    "releaseYear":  movieRelease
                },
                headers: {
                    Authorization: `${token}`
                }
            }).then((response) => {
                movieId = response.body.id
                movieTitle = response.body.title
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
    
    after(() => {
        cy.deletarFilme(movieId)
    })

    it('Listar todos os filmes com sucesso', () => {
        cy.request('GET', '/movies').then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
            expect(response.body[0]).to.have.property('title')
            expect(response.body[0]).to.have.property('genre')
            expect(response.body[0]).to.have.property('description')
            expect(response.body[0]).to.have.property('durationInMinutes')
            expect(response.body[0]).to.have.property('releaseYear')
            expect(response.body[0]).to.have.property('totalRating')


        })
    })

    it('Pesquisar filme por ID com sucesso', () => {

        cy.request({
            method: 'GET',
            url: `/movies/` + movieId

        }).then((response) => {
            expect(response.status).to.equal(200)

            expect(response.body).to.have.property('title')
            expect(response.body).to.have.property('genre')
            expect(response.body).to.have.property('description')
            expect(response.body).to.have.property('durationInMinutes')
            expect(response.body).to.have.property('releaseYear')
            expect(response.body).to.have.property('reviews')
        })

    })

    it('Pesquisar filme por Titulo com sucesso', () => {
        cy.request({
            method: 'GET',
            url: `/movies/search?title=` + movieTitle,

        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')

            expect(response.body[0]).to.have.property('title')
            expect(response.body[0]).to.have.property('genre')
            expect(response.body[0]).to.have.property('description')
            expect(response.body[0]).to.have.property('durationInMinutes')
            expect(response.body[0]).to.have.property('releaseYear')
            expect(response.body[0]).to.have.property('totalRating')
            // nao criei caso de erro pois mesmo colocando um titulo que nao existe, a api retorna 200 pois a chamada foi feita

        })
    })
})

