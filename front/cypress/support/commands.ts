
// front/cypress/support/commands.ts
import { EMAIL_FIELD, PASSWORD_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, SUBMIT_BUTTON } from '../e2e/selectors';
import { NEW_USER_EMAIL, NEW_USER_PASSWORD, YOGA_USER_EMAIL, YOGA_USER_PASSWORD } from '../e2e/test-data';


declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
            register(user: { firstName: string; lastName: string; email: string; password: string }): Chainable<void>;
            delete_users(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login').as('loginRequest');
    cy.get(EMAIL_FIELD).type(email);
    cy.get(PASSWORD_FIELD).type(password);
    cy.get(SUBMIT_BUTTON).click();
    //cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    //cy.url().should('include', '/sessions');
});

Cypress.Commands.add('register', (user: { firstName: string; lastName: string; email: string; password: string }) => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register').as('registerRequest');
    cy.get(FIRST_NAME_FIELD).type(user.firstName);
    cy.get(LAST_NAME_FIELD).type(user.lastName);
    cy.get(EMAIL_FIELD).type(user.email);
    cy.get(PASSWORD_FIELD).type(user.password);
    cy.get(SUBMIT_BUTTON).click();
    //cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);
    //cy.url().should('include', '/login');
});


Cypress.Commands.add('delete_users', () => {
    // Suppression du premier utilisateur (NEW_USER) - indépendant
    cy.login(NEW_USER_EMAIL, NEW_USER_PASSWORD);
    cy.wait('@loginRequest').then((interception) => {
        if (interception.response && interception.response.statusCode === 200) {
            cy.url().should('include', '/sessions'); // Vérifier redirection après connexion
            cy.log('Connexion NEW_USER réussie, proceeding to delete');

            // Aller sur /me
            cy.intercept('GET', '/api/user/*').as('userRequest1');
            cy.get('span[routerLink="me"]').click();
            cy.wait('@userRequest1').then((getInterception) => {
                if (getInterception.response && getInterception.response.statusCode === 200) {
                    cy.intercept('DELETE', '/api/user/*').as('userDeleteRequest1');
                    cy.get('button').contains('Delete').click();
                    cy.wait('@userDeleteRequest1').then((deleteInterception) => {
                        if (deleteInterception.response && deleteInterception.response.statusCode === 200) {
                            cy.log('Utilisateur NEW_USER supprimé avec succès');
                            cy.url().should('include', '/login');
                        } else {
                            cy.log('Échec de suppression de NEW_USER, code: ' + (deleteInterception.response?.statusCode || 'inconnu'));
                        }
                    });
                } else {
                    cy.log('Utilisateur NEW_USER non trouvé, code: ' + (getInterception.response?.statusCode || 'inconnu'));
                }
            });
        } else {
            cy.log('Échec de connexion NEW_USER, code: ' + (interception.response?.statusCode || 'inconnu'));
        }
    });

    // Suppression du deuxième utilisateur (YOGA_USER) - indépendant
    cy.login(YOGA_USER_EMAIL, YOGA_USER_PASSWORD);
    cy.wait('@loginRequest').then((interception) => {
        if (interception.response && interception.response.statusCode === 200) {
            cy.url().should('include', '/sessions'); // Vérifier redirection après connexion
            cy.log('Connexion YOGA_USER réussie, proceeding to delete');

            // Aller sur /me
            cy.intercept('GET', '/api/user/*').as('userRequest2');
            cy.get('span[routerLink="me"]').click();
            cy.wait('@userRequest2').then((getInterception) => {
                if (getInterception.response && getInterception.response.statusCode === 200) {
                    cy.intercept('DELETE', '/api/user/*').as('userDeleteRequest2');
                    cy.get('button').contains('Delete').click();
                    cy.wait('@userDeleteRequest2').then((deleteInterception) => {
                        if (deleteInterception.response && deleteInterception.response.statusCode === 200) {
                            cy.log('Utilisateur YOGA_USER supprimé avec succès');
                            cy.url().should('include', '/login');
                        } else {
                            cy.log('Échec de suppression de YOGA_USER, code: ' + (deleteInterception.response?.statusCode || 'inconnu'));
                        }
                    });
                } else {
                    cy.log('Utilisateur YOGA_USER non trouvé, code: ' + (getInterception.response?.statusCode || 'inconnu'));
                }
            });
        } else {
            cy.log('Échec de connexion YOGA_USER, code: ' + (interception.response?.statusCode || 'inconnu'));
        }
    });
});










// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
