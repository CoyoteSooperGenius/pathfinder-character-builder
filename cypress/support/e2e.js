// Cypress support file for e2e tests

// Clear localStorage before each test to ensure clean state
beforeEach(() => {
  cy.clearLocalStorage()
})

// Custom commands for character creation
Cypress.Commands.add('completeAbilityScores', () => {
  cy.get('[data-cy="ability-scores-step"]').should('be.visible')
  cy.get('button').contains('Quick Set (All 14s)').click()
  cy.get('button').contains('Next').should('not.be.disabled').click()
})

Cypress.Commands.add('completeRaceSelection', () => {
  cy.get('[data-cy="race-selection-step"]').should('be.visible')
  
  // Human should already be selected by default
  cy.get('input[value="Human"][type="radio"]').should('be.checked')
  
  // Select ability increase (STR)
  cy.get('input[value="STR"][type="radio"]').click()
  
  // Select favored class (Fighter)
  cy.get('input[value="Fighter"][type="radio"]').click()
  
  // Select 2 bonus languages
  cy.get('input[type="checkbox"][value="Draconic"]').click()
  cy.get('input[type="checkbox"][value="Elven"]').click()
  
  // Next button should be enabled
  cy.get('button').contains('Next').should('not.be.disabled').click()
})

Cypress.Commands.add('completeClassSelection', () => {
  cy.get('[data-cy="class-selection-step"]').should('be.visible')
  
  // Select Fighter class
  cy.get('input[value="Fighter"][type="radio"]').click()
  
  // Select a bonus feat
  cy.get('select').first().select('Power Attack')
  
  // Next button should be enabled
  cy.get('button').contains('Next').should('not.be.disabled').click()
})