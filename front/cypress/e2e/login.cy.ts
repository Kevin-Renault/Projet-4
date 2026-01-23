import { YOGA_USER_EMAIL, YOGA_USER_PASSWORD, INVALID_EMAIL, INVALID_PASSWORD } from './test-data';

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

    cy.get('input[formControlName=email]').type(YOGA_USER_EMAIL)
    cy.get('input[formControlName=password]').type(`${YOGA_USER_PASSWORD}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })

  it('Login successfull (real API)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get('input[formControlName=email]').type(YOGA_USER_EMAIL)
    cy.get('input[formControlName=password]').type(`${YOGA_USER_PASSWORD}{enter}{enter}`)
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

    cy.get('input[formControlName=email]').type(INVALID_EMAIL)
    cy.get('input[formControlName=password]').type(`${YOGA_USER_PASSWORD}{enter}{enter}`)

    cy.wait('@loginRequest')
    cy.url().should('include', '/login')
  })

  it('Login fail (real API)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')

    cy.get('input[formControlName=email]').type(INVALID_EMAIL)
    cy.get('input[formControlName=password]').type(`${INVALID_PASSWORD}{enter}{enter}`)

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
    cy.url().should('include', '/login')
    cy.contains('An error occurred').should('be.visible')
  })
});