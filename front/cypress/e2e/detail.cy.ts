
import {
  BE_VISIBLE,
  NOT_EXIST,
  EXIST
} from './selectors';
import {
  ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD, NEW_USER_FIRST_NAME, NEW_USER_LAST_NAME, NEW_USER_EMAIL, NEW_USER_PASSWORD,
  YOGA_USER_EMAIL,
  YOGA_USER_PASSWORD
} from './test-data';



describe('Detail spec', () => {
  before(() => {
    cy.delete_users();
    cy.register(
      {
        firstName: NEW_USER_FIRST_NAME, lastName: NEW_USER_LAST_NAME,
        email: YOGA_USER_EMAIL, password: YOGA_USER_PASSWORD
      }
    );
    cy.register(
      {
        firstName: NEW_USER_FIRST_NAME, lastName: NEW_USER_LAST_NAME,
        email: NEW_USER_EMAIL, password: NEW_USER_PASSWORD
      }
    );
  });

  it('Delete session not possible when not admin', () => {
    cy.login(NEW_USER_EMAIL, NEW_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    cy.intercept('GET', '/api/session/*').as('session')

    cy.get('button').contains('Detail').first().click();

    // Attendre le chargement des données
    cy.wait('@session')

    // Vérifications pour session
    cy.contains('attendees ').should(BE_VISIBLE)
    cy.contains('Description:').should(BE_VISIBLE)
    cy.contains('Create at:').should(BE_VISIBLE)
    cy.contains('Last update:').should(BE_VISIBLE)
    cy.get('button').contains('Delete').should(NOT_EXIST)
    cy.get('button').contains('Participate').should(EXIST)
    cy.get('button').contains('Participate').should(BE_VISIBLE)

    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')

  })


  it('Delete session possible when admin', () => {

    cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    cy.intercept('GET', '/api/session/*').as('session')

    cy.get('button').contains('Detail').first().click();

    // Attendre le chargement des données
    cy.wait('@session')

    // Vérifications pour User
    cy.contains('attendees ').should(BE_VISIBLE)
    cy.contains('Description:').should(BE_VISIBLE)
    cy.contains('Create at:').should(BE_VISIBLE)
    cy.contains('Last update:').should(BE_VISIBLE)
    cy.get('button').contains('Delete').should(BE_VISIBLE)
    cy.get('button').contains('Participate').should(NOT_EXIST)
    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })



  it('Participate on session then unparticipate', () => {
    cy.login(NEW_USER_EMAIL, NEW_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    cy.intercept('GET', '/api/session/*').as('session')

    cy.get('button').contains('Detail').first().click();

    // Attendre le chargement des données
    cy.wait('@session')

    cy.get('button').contains('Participate').first().click();
    cy.get('button').contains('Do not participate').should(EXIST)
    cy.get('button').contains('Participate').should(NOT_EXIST)
    cy.get('button').contains('Do not participate').first().click();

    cy.get('button').contains('Do not participate').should(NOT_EXIST)
    cy.get('button').contains('Participate').should(EXIST)

    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })


  after(() => {
    cy.delete_users();
  });
});
