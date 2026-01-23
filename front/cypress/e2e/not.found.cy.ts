
import { EMAIL_FIELD, PASSWORD_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, SUBMIT_BUTTON } from './selectors';




describe('Not found spec', () => {

  it('Display Not found page when url not exist (Real Api)', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get(EMAIL_FIELD).type("yoga@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}{enter}`)
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/sessions')

    cy.visit('/url_not_real')
    cy.contains('Page not found !')
  })
});