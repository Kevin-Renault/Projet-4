
import {
  SESSION_NAME_FIELD, SESSION_DATE_FIELD, SESSION_TEACHER_FIELD, SESSION_DESCRIPTION_FIELD
} from './selectors';
import {
  ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD,
  SESSION_NAME, SESSION_DATE, SESSION_DESCRIPTION
} from './test-data';



describe('Form spec', () => {

  it('Create session', () => {
    let sessionId: number | undefined; // Déclarer sessionId avec type

    cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);
    // Intercepter la requête session réelle pour attendre son chargement
    //cy.intercept('GET', '/api/session/*').as('session');

    cy.get('button').contains('Create').first().click();

    // Attendre le chargement des données
    //cy.wait('@session');

    cy.intercept('POST', '/api/session').as('sessionRequest');
    cy.get(SESSION_NAME_FIELD).type(SESSION_NAME);
    cy.get(SESSION_DATE_FIELD).type(SESSION_DATE);
    cy.get(SESSION_TEACHER_FIELD).click(); // Ouvrir le select
    //cy.get('mat-option').first().click(); // Sélectionner le premier enseignant disponible
    cy.get('mat-option').eq(1).click();
    cy.get(SESSION_DESCRIPTION_FIELD).type(SESSION_DESCRIPTION);
    cy.get('button').contains('Save').click();
    // Attendre le chargement des données
    cy.wait('@sessionRequest').then((interception) => {
      if (interception.response && interception.response.statusCode === 200) {
        sessionId = interception.response.body.id; // Récupérer l'id de la session créée
        cy.log('Session créée avec id: ' + sessionId);
      } else {
        cy.log('Échec de création de session, code: ' + (interception.response?.statusCode || 'inconnu'));
      }
    });

    cy.url().should('include', '/sessions')

    // Éditer la session créée (en utilisant la dernière session comme la plus récente)
    cy.get('mat-card').last().find('button').contains('Edit').click(); // Cliquer sur le bouton Edit de la dernière session
    cy.get(SESSION_DESCRIPTION_FIELD).clear().type(SESSION_DESCRIPTION + ' (modifié)'); // Modification banale de la description
    cy.get('button').contains('Save').click(); // Enregistrer
    cy.url().should('include', '/sessions'); // Retour à la liste des sessions

    // Supprimer la session via le bouton Delete dans le détail de la session
    cy.then(() => {
      if (sessionId) {

        cy.get('mat-card').last().find('button').contains('Detail').click();
        cy.intercept('POST', '/api/session/' + sessionId).as('sessionDeleteRequest');
        cy.get('button').contains('Delete').click();
        cy.url().should('include', '/sessions'); // Retour à la liste des sessions
      }
    });
  })
});
