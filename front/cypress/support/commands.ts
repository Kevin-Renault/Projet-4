
// front/cypress/support/commands.ts
import { EMAIL_FIELD, PASSWORD_FIELD, FIRST_NAME_FIELD, LAST_NAME_FIELD, SUBMIT_BUTTON } from '../e2e/selectors';

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
            register(user: { firstName: string; lastName: string; email: string; password: string }): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login').as('loginRequest');
    cy.get(EMAIL_FIELD).type(email);
    cy.get(PASSWORD_FIELD).type(password);
    cy.get(SUBMIT_BUTTON).click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/sessions');
});

Cypress.Commands.add('register', (user: { firstName: string; lastName: string; email: string; password: string }) => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register').as('registerRequest');
    cy.get(FIRST_NAME_FIELD).type(user.firstName);
    cy.get(LAST_NAME_FIELD).type(user.lastName);
    cy.get(EMAIL_FIELD).type(user.email);
    cy.get(PASSWORD_FIELD).type(user.password);
    cy.get(SUBMIT_BUTTON).click();
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/login');
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
