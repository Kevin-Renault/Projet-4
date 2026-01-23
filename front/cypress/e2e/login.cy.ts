import { YOGA_USER_EMAIL, YOGA_USER_PASSWORD, INVALID_EMAIL, INVALID_PASSWORD, ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD } from './test-data';

describe('Login spec', () => {


  it('UI Interactions - form elements and navigation', () => {
    cy.visit('/login')

    // Test des éléments du formulaire - cela exécute le code Angular
    cy.get('input[formControlName=email]').should('be.visible').and('be.enabled')
    cy.get('input[formControlName=password]').should('be.visible').and('be.enabled')
    cy.get('button[type=submit]').should('be.visible').and('contain', 'Submit')

    // Test de la saisie - déclenche les validateurs Angular
    cy.get('input[formControlName=email]').type('test@example.com')
    cy.get('input[formControlName=password]').type('password123')

    // Vérifier que les valeurs sont correctement liées (Angular binding)
    cy.get('input[formControlName=email]').should('have.value', 'test@example.com')
    cy.get('input[formControlName=password]').should('have.value', 'password123')

    // Test de la navigation vers register (si le lien existe)
    cy.get('a').contains('Register').should('be.visible')
  })

  it('Comprehensive UI Coverage Test', () => {
    // Test qui visite toutes les pages pour maximiser la couverture
    cy.visit('/')
    cy.url().should('include', '/')

    cy.visit('/login')
    cy.get('input[formControlName=email]').should('exist')
    cy.get('input[formControlName=password]').should('exist')

    cy.visit('/register')
    cy.get('input[formControlName=firstName]').should('exist')
    cy.get('input[formControlName=lastName]').should('exist')
    cy.get('input[formControlName=email]').should('exist')
    cy.get('input[formControlName=password]').should('exist')

    cy.visit('/sessions')
    cy.get('input[formControlName=email]').should('exist')
    cy.get('input[formControlName=password]').should('exist')

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
    cy.get('input[formControlName=email]').type(ADMIN_USER_EMAIL)
    cy.get('input[formControlName=password]').type(`${ADMIN_USER_PASSWORD}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')
    cy.get('span').contains('Logout').click()
    cy.url().should('include', '/login')
  })

  it('Login fail', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')

    cy.get('input[formControlName=email]').type(INVALID_EMAIL)
    cy.get('input[formControlName=password]').type(`${INVALID_PASSWORD}{enter}{enter}`)

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
    cy.url().should('include', '/login')
    cy.contains('An error occurred').should('be.visible')
  })

});