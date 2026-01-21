
import { BE_VISIBLE, NOT_EXIST } from './selectors';
import {
  ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD, NEW_USER_FIRST_NAME,
  NEW_USER_LAST_NAME, NEW_USER_EMAIL, NEW_USER_PASSWORD
} from './test-data';




describe('Me spec', () => {




  it('Display user info after login', () => {
    cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);

    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/1').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    // Vérifications (ajustez si les données réelles diffèrent)
    cy.contains('User information').should(BE_VISIBLE)
    cy.contains('Name: Admin ADMIN').should(BE_VISIBLE)
    cy.contains('Email: yoga@studio.com').should(BE_VISIBLE)
    cy.contains('You are admin').should(BE_VISIBLE)
    cy.contains('Create at:').should(BE_VISIBLE)
    cy.contains('Last update:').should(BE_VISIBLE)

    cy.get('mat-icon').contains('arrow_back').parent('button').click()
    cy.url().should('include', '/sessions')
  })


  it('Delete user not possible when admin', () => {
    cy.login(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);
    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/1').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    // Vérifications pour admin : le bouton Delete n'existe pas
    cy.contains('You are admin').should(BE_VISIBLE)
    cy.contains('Delete my account:').should(NOT_EXIST)
    cy.get('button').contains('Delete').should(NOT_EXIST)
  })

  it('Register login then Delete user', () => {
    cy.delete_users();
    cy.register(
      { firstName: NEW_USER_FIRST_NAME, lastName: NEW_USER_LAST_NAME, email: NEW_USER_EMAIL, password: NEW_USER_PASSWORD }
    );

    cy.login(NEW_USER_EMAIL, NEW_USER_PASSWORD);
    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/*').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    cy.intercept('DELETE', '/api/user/*').as('userDeleteRequest')

    cy.get('button').contains('Delete').click()

    cy.wait('@userDeleteRequest').its('response.statusCode').should('eq', 200)

    cy.url().should('include', '/login')
  })

  it('Register login then Delete user 2', () => {
    cy.delete_users();
    cy.register(
      {
        firstName: NEW_USER_FIRST_NAME, lastName: NEW_USER_LAST_NAME,
        email: NEW_USER_EMAIL, password: NEW_USER_PASSWORD
      }
    );

    cy.login(NEW_USER_EMAIL, NEW_USER_PASSWORD);


    // Intercepter la requête user réelle pour attendre son chargement
    cy.intercept('GET', '/api/user/*').as('user')

    // Aller sur /me via le bouton Account
    cy.get('span[routerLink="me"]').click()

    // Attendre le chargement des données
    cy.wait('@user')

    // Intercepter la vraie requête DELETE
    cy.intercept('DELETE', '/api/user/*').as('deleteRequest')

    // Cliquer sur le bouton Delete
    cy.get('button').contains('Delete').click()

    // Attendre la vraie requête DELETE et vérifier succès
    cy.wait('@deleteRequest').its('response.statusCode').should('eq', 200)

    // // Après delete, l'utilisateur est déconnecté et redirigé vers /
    cy.url().should('include', '/')
  })
});