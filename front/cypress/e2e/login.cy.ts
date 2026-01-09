import {
  INVALID_EMAIL, INVALID_PASSWORD,
  ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD
} from './test-data';
import {
  BE_VISIBLE, EMAIL_FIELD, EXIST, FIRST_NAME_FIELD,
  LAST_NAME_FIELD, PASSWORD_FIELD,
  SUBMIT_BUTTON
} from './selectors';

describe('Login spec', () => {


  it('UI Interactions - form elements and navigation', () => {
    cy.visit('/login')

    // Test des éléments du formulaire - cela exécute le code Angular
    cy.get(EMAIL_FIELD).should(BE_VISIBLE).and('be.enabled')
    cy.get(PASSWORD_FIELD).should(BE_VISIBLE).and('be.enabled')
    cy.get(SUBMIT_BUTTON).should(BE_VISIBLE).and('contain', 'Submit')

    // Test de la saisie - déclenche les validateurs Angular
    cy.get(EMAIL_FIELD).type('test@example.com')
    cy.get(PASSWORD_FIELD).type('password123')

    // Vérifier que les valeurs sont correctement liées (Angular binding)
    cy.get(EMAIL_FIELD).should('have.value', 'test@example.com')
    cy.get(PASSWORD_FIELD).should('have.value', 'password123')

    // Test de la navigation vers register (si le lien existe)
    cy.get('a').contains('Register').should(BE_VISIBLE)
  })

  it('Comprehensive UI Coverage Test', () => {
    // Test qui visite toutes les pages pour maximiser la couverture
    cy.visit('/')
    cy.url().should('include', '/')

    cy.visit('/login')
    cy.get(EMAIL_FIELD).should(EXIST)
    cy.get(PASSWORD_FIELD).should(EXIST)

    cy.visit('/register')
    cy.get(FIRST_NAME_FIELD).should(EXIST)
    cy.get(LAST_NAME_FIELD).should(EXIST)
    cy.get(EMAIL_FIELD).should(EXIST)
    cy.get(PASSWORD_FIELD).should(EXIST)

    cy.visit('/sessions')
    cy.get(EMAIL_FIELD).should(EXIST)
    cy.get(PASSWORD_FIELD).should(EXIST)

    // Test de navigation entre pages
    cy.visit('/login')
    cy.get('a').contains('Register').click()
    cy.url().should('include', '/register')

    cy.visit('/register')
    cy.get('a').contains('Login').click()
    cy.url().should('include', '/login')
  })

  it('Login successfull', () => {
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get(EMAIL_FIELD).type(ADMIN_USER_EMAIL)
    cy.get(PASSWORD_FIELD).type(`${ADMIN_USER_PASSWORD}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')
    cy.get('span').contains('Logout').click()
    cy.url().should('include', '/login')
  })

  it('Login fail', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')

    cy.get(EMAIL_FIELD).type(INVALID_EMAIL)
    cy.get(PASSWORD_FIELD).type(`${INVALID_PASSWORD}{enter}{enter}`)

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
    cy.url().should('include', '/login')
    cy.contains('An error occurred').should(BE_VISIBLE)
  })

});