


import { EMAIL_FIELD, PASSWORD_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, SUBMIT_BUTTON, DISABLED, NOT_DISABLED } from './selectors';
import { NEW_USER_FIRST_NAME, NEW_USER_LAST_NAME, NEW_USER_EMAIL, NEW_USER_PASSWORD, YOGA_USER_EMAIL, YOGA_USER_PASSWORD, INVALID_EMAIL, VALID_EMAIL, INVALID_PASSWORD } from './test-data';


describe('Register spec', () => {

  it('Register fail', () => {
    cy.visit('/register')
    cy.intercept('POST', '/api/auth/register').as('registerRequest')

    cy.get(FIRST_NAME_FIELD).type(NEW_USER_FIRST_NAME)
    cy.get(LAST_NAME_FIELD).type(NEW_USER_LAST_NAME)
    cy.get(EMAIL_FIELD).type(YOGA_USER_EMAIL)
    cy.get(PASSWORD_FIELD).type(`${YOGA_USER_PASSWORD}{enter}{enter}`)

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 400)
    cy.url().should('include', '/register')
    cy.contains('An error occurred').should('be.visible')
  })

  it('Form validation errors', () => {
    cy.visit('/register')

    // Test paramètre non renseigné
    cy.get(FIRST_NAME_FIELD).type(NEW_USER_FIRST_NAME)
    cy.get(EMAIL_FIELD).type(VALID_EMAIL)
    cy.get(PASSWORD_FIELD).type(YOGA_USER_PASSWORD)
    cy.get(SUBMIT_BUTTON).should(DISABLED)

    // Test mot de passe trop court
    cy.get(FIRST_NAME_FIELD).type(NEW_USER_FIRST_NAME)
    cy.get(LAST_NAME_FIELD).type(NEW_USER_LAST_NAME)
    cy.get(EMAIL_FIELD).clear().type(VALID_EMAIL)
    cy.get(PASSWORD_FIELD).clear().type(INVALID_PASSWORD)  // < 3 caractères
    cy.get(SUBMIT_BUTTON).should(DISABLED)


    // Test email invalide
    cy.get(EMAIL_FIELD).clear().type(INVALID_EMAIL)  // Email sans @
    cy.get(PASSWORD_FIELD).clear().type(YOGA_USER_PASSWORD)
    cy.get(SUBMIT_BUTTON).should(DISABLED)


    // Test prénom trop court
    cy.get(FIRST_NAME_FIELD).clear().type("A")  // < 3 caractères
    cy.get(SUBMIT_BUTTON).should(DISABLED)

    // Avec données valides, bouton activé
    cy.get(FIRST_NAME_FIELD).clear().type(NEW_USER_FIRST_NAME)
    cy.get(LAST_NAME_FIELD).clear().type(NEW_USER_LAST_NAME)
    cy.get(EMAIL_FIELD).clear().type(VALID_EMAIL)
    cy.get(PASSWORD_FIELD).clear().type(YOGA_USER_PASSWORD)
    cy.get(SUBMIT_BUTTON).should(NOT_DISABLED)
  })

});