describe('Login spec', () => {
  it('Login successfull (Mock Api)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })


  it('Login successfull (real API)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')
  })

  it('Login fail (Mock Api)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      },
    }).as('loginRequest')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.net")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@loginRequest')
    cy.url().should('include', '/login')
  })

  it('Login fail (real API)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')

    cy.get('input[formControlName=email]').type("wrong@email.com")
    cy.get('input[formControlName=password]').type(`${"wrongpassword"}{enter}{enter}`)

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
    cy.url().should('include', '/login')
    cy.contains('An error occurred').should('be.visible')
  })



});