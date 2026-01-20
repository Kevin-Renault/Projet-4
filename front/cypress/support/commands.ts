
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
});

Cypress.Commands.add('register', (user: { firstName: string; lastName: string; email: string; password: string }) => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register').as('registerRequest');
    cy.get(FIRST_NAME_FIELD).type(user.firstName);
    cy.get(LAST_NAME_FIELD).type(user.lastName);
    cy.get(EMAIL_FIELD).type(user.email);
    cy.get(PASSWORD_FIELD).type(user.password);
    cy.get(SUBMIT_BUTTON).click();
});



Cypress.Commands.add('delete_users', () => {
    const users = [
        { email: NEW_USER_EMAIL, password: NEW_USER_PASSWORD },
        { email: YOGA_USER_EMAIL, password: YOGA_USER_PASSWORD }
    ];

    users.forEach(({ email, password }) => {
        // Connexion pour récupérer le token
        cy.request({
            method: 'POST',
            url: '/api/auth/login',
            body: { email, password },
            failOnStatusCode: false
        }).then((loginResp) => {
            if (loginResp.status === 401) {
                // Si l'utilisateur n'existe pas, on considère comme déjà supprimé
                cy.log(`Utilisateur ${email} déjà supprimé ou inexistant`);
                return;
            }
            // Si autre code inattendu, échouer
            expect(loginResp.status, `Login status pour ${email}`).to.eq(200);
            const token = loginResp.body.token;

            // GET /api/user/me pour vérifier existence
            cy.request({
                method: 'GET',
                url: '/api/user/me',
                headers: { Authorization: `Bearer ${token}` },
                failOnStatusCode: false
            }).then((getResp) => {
                if (getResp.status !== 200) {
                    // L'utilisateur n'existe pas, rien à faire
                    cy.log(`Utilisateur ${email} inexistant (GET)`);
                    return;
                }

                // DELETE /api/user/{id}
                const userId = getResp.body.id;
                cy.request({
                    method: 'DELETE',
                    url: `/api/user/${userId}`,
                    headers: { Authorization: `Bearer ${token}` },
                    failOnStatusCode: false
                }).then((delResp) => {
                    expect(delResp.status).to.be.oneOf([200, 204]);

                    // Vérification finale : GET doit renvoyer 404
                    cy.request({
                        method: 'GET',
                        url: `/api/user/${userId}`,
                        headers: { Authorization: `Bearer ${token}` },
                        failOnStatusCode: false
                    }).then((finalGet) => {
                        expect(finalGet.status).to.eq(404);
                        cy.log(`Utilisateur ${email} inexistant (GET) : 404 confirmé après suppression`);
                    });
                });
            });
        });
    });
});
