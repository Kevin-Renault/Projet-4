import { ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD } from './test-data';




describe('Not found spec', () => {

  it('Display Not found page when url not exist (Real Api)', () => {
    cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);
    cy.visit('/url_not_real')
    cy.contains('Page not found !')
  })
});