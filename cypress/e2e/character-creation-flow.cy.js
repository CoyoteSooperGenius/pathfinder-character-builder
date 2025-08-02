describe('Character Creation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('button').contains('Create Character').click()
  })

  it('should complete full character creation with Human Fighter', () => {
    // Wait for Vue components to load and check what's actually there
    cy.wait(1000)
    
    // Check if stepper is visible with any step
    cy.get('h2').should('be.visible')
    cy.get('h2').then(($h2) => {
      cy.log('Found h2 with text: ' + $h2.text())
    })
    
    // Check if we can find the specific step title (case insensitive)
    cy.get('body').should('contain', 'Ability Scores')
    
    // Step 1: Ability Scores - Select Point Buy method first
    cy.get('select#ability-method').select('Point Buy')
    
    // Now the Quick Set button should be available
    cy.get('button').contains('Quick Set (All 14s)').click()
    
    // Verify ability scores are set - check that the table shows 14s
    cy.get('tbody tr').should('have.length', 6) // Six ability rows
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).should('contain', '14')
    })
    cy.get('button').contains('Next').should('not.be.disabled').click()

    // Step 2: Race Selection - Human with customizations
    cy.get('h2').contains('Pick Your Race').should('be.visible')
    
    // Wait for race components to load
    cy.wait(1000)
    
    // Human should be selected by default
    cy.get('input[value="Human"][type="radio"]').should('be.checked')
    
    // Look for ability adjustment section
    cy.get('body').should('contain', 'Ability Score Adjustments')
    
    // Select STR increase (checkbox for humans)
    cy.get('input[value="STR"][type="checkbox"]', { timeout: 10000 }).click()
    
    // Select Fighter as favored class
    cy.get('input[value="Fighter"][type="radio"]').click()
    
    // Select 2 bonus languages (Human with +2 INT gets Common + 2 bonus)
    cy.get('input[type="checkbox"][value="Draconic"]').click()
    cy.get('input[type="checkbox"][value="Elven"]').click()
    
    // Verify language count updates (may take a moment)
    cy.contains('All Known Languages: 3', { timeout: 10000 }).should('be.visible')
    
    // Next button should be enabled
    cy.get('button').contains('Next').should('not.be.disabled').click()

    // Step 3: Class Selection - Fighter
    cy.get('h2').contains('Pick Your Class').should('be.visible')
    
    // Select Fighter
    cy.get('input[value="Fighter"][type="radio"]').click()
    
    // Select bonus feat
    cy.get('select').first().select('Power Attack')
    
    cy.get('button').contains('Next').should('not.be.disabled').click()

    // Step 4: Skills (currently placeholder)
    cy.get('h2').contains('Pick Skills').should('be.visible')
    cy.get('button').contains('Next').click()

    // Step 5: Feats (currently placeholder)  
    cy.get('h2').contains('Pick Feats').should('be.visible')
    cy.get('button').contains('Next').click()

    // Step 6: Equipment (currently placeholder)
    cy.get('h2').contains('Buy Equipment').should('be.visible')
    cy.get('button').contains('Next').click()

    // Step 7: Details (currently placeholder)
    cy.get('h2').contains('Finishing Details').should('be.visible')
    cy.get('button').contains('Finish').click()

    // Verify we're on the character sheet
    cy.get('h3').contains('Character Sheet').should('be.visible')
    
    // Verify character data
    cy.contains('Human').should('be.visible')
    cy.contains('Fighter').should('be.visible')
    cy.contains('STR: 15').should('be.visible') // 14 + 1 racial
    cy.contains('Draconic').should('be.visible')
    cy.contains('Elven').should('be.visible')
  })

  it('should prevent progression with incomplete steps', () => {
    // Step 1: Try to proceed without setting ability scores
    cy.get('h2').contains('Determine Ability Scores').should('be.visible')
    cy.get('button').contains('Next').should('be.disabled')
    
    // Complete ability scores - select method first
    cy.get('select#ability-method').select('Point Buy')
    cy.get('button').contains('Quick Set (All 14s)').click()
    cy.get('button').contains('Next').should('not.be.disabled').click()

    // Step 2: Try to proceed without completing race selections
    cy.get('h2').contains('Pick Your Race').should('be.visible')
    
    // Only select ability increase, not favored class or languages
    cy.get('input[value="STR"][type="checkbox"]').click()
    cy.get('button').contains('Next').should('be.disabled')
    
    // Add favored class but not languages
    cy.get('input[value="Fighter"][type="radio"]').click()
    cy.get('button').contains('Next').should('be.disabled')
    
    // Add required languages
    cy.get('input[type="checkbox"][value="Draconic"]').click()
    cy.get('input[type="checkbox"][value="Elven"]').click()
    cy.get('button').contains('Next').should('not.be.disabled')
  })

  it('should maintain character data in localStorage', () => {
    // Complete first two steps
    cy.get('select#ability-method').select('Point Buy')
    cy.get('button').contains('Quick Set (All 14s)').click()
    cy.get('button').contains('Next').click()
    
    cy.get('input[value="STR"][type="checkbox"]').click()
    cy.get('input[value="Fighter"][type="radio"]').click()
    cy.get('input[type="checkbox"][value="Draconic"]').click()
    cy.get('input[type="checkbox"][value="Elven"]').click()
    cy.get('button').contains('Next').click()

    // Refresh page and verify data persists
    cy.reload()
    cy.wait(1000) // Wait for Vue to reinitialize
    
    // Should be on step 3 (class selection)
    cy.get('h2').contains('Pick Your Class', { timeout: 10000 }).should('be.visible')
    
    // Character sheet should show previous selections
    cy.contains('Human').should('be.visible')
    cy.contains('STR: 15').should('be.visible')
  })
})