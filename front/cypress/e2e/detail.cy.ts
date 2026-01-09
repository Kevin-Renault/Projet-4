
import {
  SESSION_NAME_FIELD, SESSION_DATE_FIELD, SESSION_TEACHER_FIELD, SESSION_DESCRIPTION_FIELD,
  SESSION_SUBMIT_BUTTON, DISABLED, NOT_DISABLED
} from './selectors';
import {
  ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD, SESSION_NAME, SESSION_DATE, SESSION_DESCRIPTION,
  SESSION_TEACHER_ID,
  YOGA_USER_EMAIL
} from './test-data';



describe('Detail spec', () => {

  it('Delete session not possible when not admin - Real Api', () => {

    cy.login(YOGA_USER_EMAIL, ADMIN_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    cy.intercept('GET', '/api/session/*').as('session')

    cy.visit('/sessions');
    cy.get('button').contains('Detail').first().click();

    // Attendre le chargement des données
    cy.wait('@session')

    // Vérifications pour session
    cy.contains('Session ').should('be.visible')
    cy.contains('attendees ').should('be.visible')
    cy.contains('Description:').should('be.visible')
    cy.contains('Create at:').should('be.visible')
    cy.contains('Last update:').should('be.visible')
    cy.get('button').contains('Delete').should('not.exist')
    cy.get('button').contains('Participate').should('exist')
    cy.get('button').contains('Participate').should('be.visible')

    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })


  it('Delete session possible when admin - Real Api', () => {

    cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    cy.intercept('GET', '/api/session/*').as('session')

    cy.visit('/sessions');
    cy.get('button').contains('Detail').first().click();

    // Attendre le chargement des données
    cy.wait('@session')

    // Vérifications pour User
    cy.contains('Session ').should('be.visible')
    cy.contains('attendees ').should('be.visible')
    cy.contains('Description:').should('be.visible')
    cy.contains('Create at:').should('be.visible')
    cy.contains('Last update:').should('be.visible')
    cy.get('button').contains('Delete').should('be.visible')
    cy.get('button').contains('Participate').should('not.exist')
    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })



  it('Participate on session then unparticipate - Real Api', () => {

    cy.login(YOGA_USER_EMAIL, ADMIN_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    cy.intercept('GET', '/api/session/*').as('session')

    cy.visit('/sessions');
    cy.get('button').contains('Detail').first().click();

    // Attendre le chargement des données
    cy.wait('@session')

    cy.get('button').contains('Participate').first().click();
    cy.get('button').contains('Do not participate').should('exist')
    cy.get('button').contains('Participate').should('not.exist')
    cy.get('button').contains('Do not participate').first().click();

    cy.get('button').contains('Do not participate').should('not.exist')
    cy.get('button').contains('Participate').should('exist')

    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })


  // it('Form validation errors', () => {
  //  cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);

  //  cy.visit('/sessions');
  //  // Intercept teachers before clicking create
  //  cy.intercept('GET', '/api/teacher').as('teachers');

  //  cy.get('button').contains('Create').first().click();

  //  // Wait for the page to load
  //  cy.contains('Create session');

  //  cy.wait('@teachers');

  //  // Initially, all fields empty, button disabled
  //  cy.get(SESSION_SUBMIT_BUTTON).should(DISABLED);

  //  // Fill name, still disabled (date required)
  //  cy.get(SESSION_NAME_FIELD).type(SESSION_NAME);
  //  cy.get(SESSION_SUBMIT_BUTTON).should(DISABLED);
  //  // Fill date, still disabled (teacher required)
  //  cy.get(SESSION_DATE_FIELD).type(SESSION_DATE);
  //  cy.get(SESSION_SUBMIT_BUTTON).should(DISABLED);

  //  // Select teacher, still disabled (description required)
  //  // cy.get(SESSION_TEACHER_FIELD).click();
  //  // cy.get('mat-option').first().click();
  //  cy.get(SESSION_SUBMIT_BUTTON).should(DISABLED);

  //  // Fill description, now enabled
  //  cy.get(SESSION_DESCRIPTION_FIELD).type(SESSION_DESCRIPTION);
  //  cy.get(SESSION_SUBMIT_BUTTON).should(NOT_DISABLED);

  //  // Clear name, disabled
  //  cy.get(SESSION_NAME_FIELD).clear();
  //  cy.get(SESSION_SUBMIT_BUTTON).should(DISABLED);

  //  // Fill name, enabled again
  //  cy.get(SESSION_NAME_FIELD).type(SESSION_NAME);
  //  cy.get(SESSION_SUBMIT_BUTTON).should(NOT_DISABLED);

  //  // Test description too long
  //  const longDescription = 'a'.repeat(2001);
  //  cy.get(SESSION_DESCRIPTION_FIELD).clear().type(longDescription);
  //  cy.get(SESSION_SUBMIT_BUTTON).should(DISABLED);
  // });

});
