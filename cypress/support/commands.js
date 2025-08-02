// Custom Cypress commands for the Pathfinder Character Builder

// Command to reset application state
Cypress.Commands.add('resetApp', () => {
  cy.clearLocalStorage()
  cy.reload()
  cy.wait(500) // Give Vue time to initialize
})

// Command to verify step completion
Cypress.Commands.add('verifyStepComplete', (stepName) => {
  cy.get('button').contains('Next').should('not.be.disabled')
})

// Command to verify character sheet updates
Cypress.Commands.add('verifyCharacterSheet', (expectedData) => {
  cy.get('[data-cy="character-sheet"]').within(() => {
    if (expectedData.race) {
      cy.contains(expectedData.race).should('be.visible')
    }
    if (expectedData.class) {
      cy.contains(expectedData.class).should('be.visible')
    }
    if (expectedData.abilityScores) {
      Object.entries(expectedData.abilityScores).forEach(([ability, score]) => {
        cy.contains(ability).parent().should('contain', score)
      })
    }
  })
})