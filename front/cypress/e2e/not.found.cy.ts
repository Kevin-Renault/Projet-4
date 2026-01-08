
import { EMAIL_FIELD, PASSWORD_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, SUBMIT_BUTTON } from './selectors';
import { YOGA_USER_EMAIL, YOGA_USER_PASSWORD } from './test-data';




describe('Not found spec', () => {

  it('Display Not found page when url not exist (Real Api)', () => {
    cy.login(YOGA_USER_EMAIL, YOGA_USER_PASSWORD);

    cy.visit('/url_not_real')
    cy.contains('Page not found !')
  })
});