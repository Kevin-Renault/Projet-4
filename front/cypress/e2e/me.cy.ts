
import { EMAIL_FIELD, PASSWORD_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, SUBMIT_BUTTON } from './selectors';




describe('Me spec', () => {



  it('Display user info after login (Real Api)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get(EMAIL_FIELD).type("yoga@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')

    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/1').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    // Vérifications (ajustez si les données réelles diffèrent)
    cy.contains('User information').should('be.visible')
    cy.contains('Name: Admin ADMIN').should('be.visible')
    cy.contains('Email: yoga@studio.com').should('be.visible')
    cy.contains('You are admin').should('be.visible')
    cy.contains('Create at:').should('be.visible')
    cy.contains('Last update:').should('be.visible')

    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })


  it('Delete user not possible when admin - Real Api', () => {

    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get(EMAIL_FIELD).type("yoga@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')

    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/1').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    // Vérifications pour admin : le bouton Delete n'existe pas
    cy.contains('You are admin').should('be.visible')
    cy.contains('Delete my account:').should('not.exist')
    cy.get('button').contains('Delete').should('not.exist')
  })


  it('Delete user after register/login (Real Api)', () => {

    cy.visit('/register')
    cy.intercept('POST', '/api/auth/register').as('loginRequest')
    cy.get(FIRST_NAME_FIELD).type("John")
    cy.get(LAST_NAME_FIELD).type("Doe")
    cy.get(EMAIL_FIELD).type("yoga_user@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/login')

    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get(EMAIL_FIELD).type("yoga_user@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')

    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/*').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    // Intercepter la vraie requête DELETE (pas de mock, utilise l'id réel de session)
    cy.intercept('DELETE', '/api/user/*').as('deleteRequest')

    // Cliquer sur le bouton Delete
    cy.get('button').contains('Delete').click()

    // Attendre la vraie requête DELETE et vérifier succès
    cy.wait('@deleteRequest').its('response.statusCode').should('eq', 200)

    // Après delete, l'utilisateur est déconnecté et redirigé vers /
    cy.url().should('include', '/')
  })

});