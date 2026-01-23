


// Sélecteurs pour les champs du formulaire
const FIRST_NAME_FIELD = 'input[formControlName=firstName]'
const LAST_NAME_FIELD = 'input[formControlName=lastName]'
const EMAIL_FIELD = 'input[formControlName=email]'
const PASSWORD_FIELD = 'input[formControlName=password]'
const SUBMIT_BUTTON = 'button[type=submit]'


describe('Register spec', () => {
  it('Register successfull (Mock Api)', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        message: 'User registered successfully!',
      },
    })

    cy.get(FIRST_NAME_FIELD).type("John")
    cy.get(LAST_NAME_FIELD).type("Doe")
    cy.get(EMAIL_FIELD).type("user@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}`)
    cy.url().should('include', '/login')
  })


  it('Register fail (real API)', () => {
    cy.visit('/register')
    cy.intercept('POST', '/api/auth/register').as('registerRequest')

    cy.get(FIRST_NAME_FIELD).type("John")
    cy.get(LAST_NAME_FIELD).type("Doe")
    cy.get(EMAIL_FIELD).type("yoga@studio.com")
    cy.get(PASSWORD_FIELD).type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 400)
    cy.url().should('include', '/register')
    cy.contains('An error occurred').should('be.visible')
  })

  it('Form validation errors', () => {
    cy.visit('/register')

    // Test paramètre non renseigné
    cy.get(FIRST_NAME_FIELD).type("John")
    cy.get(EMAIL_FIELD).type("valid@email.com")
    cy.get(PASSWORD_FIELD).type("test!1234")
    cy.get(SUBMIT_BUTTON).should('be.disabled')

    // Test mot de passe trop court
    cy.get(FIRST_NAME_FIELD).type("John")
    cy.get(LAST_NAME_FIELD).type("Doe")
    cy.get(EMAIL_FIELD).clear().type("valid@email.com")
    cy.get(PASSWORD_FIELD).clear().type("12")  // < 3 caractères
    cy.get(SUBMIT_BUTTON).should('be.disabled')


    // Test email invalide
    cy.get(EMAIL_FIELD).clear().type("invalid-email.com")  // Email sans @
    cy.get(PASSWORD_FIELD).clear().type("test!1234")
    cy.get(SUBMIT_BUTTON).should('be.disabled')


    // Test prénom trop court
    cy.get(FIRST_NAME_FIELD).clear().type("A")  // < 3 caractères
    cy.get(SUBMIT_BUTTON).should('be.disabled')

    // Avec données valides, bouton activé
    cy.get(FIRST_NAME_FIELD).clear().type("John")
    cy.get(LAST_NAME_FIELD).clear().type("Doe")
    cy.get(EMAIL_FIELD).clear().type("valid@email.com")
    cy.get(PASSWORD_FIELD).clear().type("test!1234")
    cy.get(SUBMIT_BUTTON).should('not.be.disabled')
  })

});