describe('Bug Regression Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('button').contains('Create Character').click()
  })

  describe('Race Selection Step Completion Bug', () => {
    it('should enable Next button only when all race requirements are met', () => {
      // Complete ability scores first
      cy.get('button').contains('Quick Set (All 14s)').click()
      cy.get('button').contains('Next').click()

      // Initially Next should be disabled
      cy.get('button').contains('Next').should('be.disabled')

      // Select race (Human is default)
      cy.get('input[value="Human"][type="radio"]').should('be.checked')
      cy.get('button').contains('Next').should('be.disabled')

      // Select ability increase
      cy.get('input[value="STR"][type="radio"]').click()
      cy.get('button').contains('Next').should('be.disabled')

      // Select favored class
      cy.get('input[value="Fighter"][type="radio"]').click()
      cy.get('button').contains('Next').should('be.disabled')

      // Select first bonus language
      cy.get('input[type="checkbox"][value="Draconic"]').click()
      cy.get('button').contains('Next').should('be.disabled')

      // Select second bonus language - NOW Next should enable
      cy.get('input[type="checkbox"][value="Elven"]').click()
      cy.get('button').contains('Next').should('not.be.disabled')
    })

    it('should update language count display correctly', () => {
      // Complete ability scores first
      cy.get('button').contains('Quick Set (All 14s)').click()
      cy.get('button').contains('Next').click()

      // Initially should show 1 language (Common)
      cy.contains('All Known Languages: 1').should('be.visible')

      // After selecting first bonus language
      cy.get('input[type="checkbox"][value="Draconic"]').click()
      cy.contains('All Known Languages: 2').should('be.visible')

      // After selecting second bonus language
      cy.get('input[type="checkbox"][value="Elven"]').click()
      cy.contains('All Known Languages: 3').should('be.visible')

      // Deselecting should decrease count
      cy.get('input[type="checkbox"][value="Draconic"]').click()
      cy.contains('All Known Languages: 2').should('be.visible')
    })

    it('should work correctly with different races and INT modifiers', () => {
      // Set up custom ability scores with different INT
      cy.get('select').first().select('30 Points (Epic Fantasy)')
      
      // Set high INT for bonus languages
      // Increase INT to 16 (+3 modifier)
      cy.get('tr').contains('INT').parent().within(() => {
        cy.get('button').contains('+').click().click().click().click().click().click() // 10->16
      })
      
      // Decrease other abilities to balance points
      cy.get('tr').contains('STR').parent().within(() => {
        cy.get('button').contains('-').click().click().click() // 10->7
      })
      cy.get('tr').contains('DEX').parent().within(() => {
        cy.get('button').contains('-').click().click().click() // 10->7
      })
      
      cy.get('button').contains('Next').click()

      // Select Elf (gets Elven automatic + INT bonus languages)
      cy.get('input[value="Elf"][type="radio"]').click()

      // Should need 1 automatic (Common, Elven) + 3 bonus from INT = 5 total
      // Initially should show 2 (Common + Elven)
      cy.contains('All Known Languages: 2').should('be.visible')

      // Select 3 bonus languages
      cy.get('input[type="checkbox"][value="Draconic"]').click()
      cy.contains('All Known Languages: 3').should('be.visible')
      
      cy.get('input[type="checkbox"][value="Celestial"]').click()
      cy.contains('All Known Languages: 4').should('be.visible')
      
      cy.get('input[type="checkbox"][value="Gnome"]').click()
      cy.contains('All Known Languages: 5').should('be.visible')

      // Now Next button should be enabled
      cy.get('button').contains('Next').should('not.be.disabled')
    })
  })

  describe('Traits Display Bug', () => {
    it('should display racial traits correctly after race selection', () => {
      // Complete ability scores first
      cy.get('button').contains('Quick Set (All 14s)').click()
      cy.get('button').contains('Next').click()

      // Human traits should be visible and properly formatted
      cy.contains('Skilled').should('be.visible')
      cy.contains('Bonus Feat').should('be.visible')
      
      // Change to Elf and verify traits update
      cy.get('input[value="Elf"][type="radio"]').click()
      cy.contains('Low-Light Vision').should('be.visible')
      cy.contains('Elven Immunities').should('be.visible')
      cy.contains('Keen Senses').should('be.visible')

      // Traits should not be empty boxes
      cy.get('[data-cy="racial-traits"]').within(() => {
        cy.get('li').should('have.length.greaterThan', 0)
        cy.get('li').each(($li) => {
          cy.wrap($li).should('not.be.empty')
          cy.wrap($li).find('strong').should('exist')
        })
      })
    })
  })

  describe('Point Buy Quick Set Bug', () => {
    it('should enable Next button after Quick Set regardless of point buy system', () => {
      // Test with default 20-point system
      cy.get('select').first().should('have.value', '20')
      cy.get('button').contains('Quick Set (All 14s)').click()
      
      // Should automatically switch to 30-point system and enable Next
      cy.get('select').first().should('have.value', '30')
      cy.contains('Remaining Points: 0').should('be.visible')
      cy.get('button').contains('Next').should('not.be.disabled')
    })

    it('should work with any point buy system', () => {
      // Test with 15-point system
      cy.get('select').first().select('15 Points (Low Fantasy)')
      cy.get('button').contains('Quick Set (All 14s)').click()
      
      // Should switch to 30-point and work
      cy.get('select').first().should('have.value', '30')
      cy.contains('Remaining Points: 0').should('be.visible')
      cy.get('button').contains('Next').should('not.be.disabled')

      // Reset and test with 25-point
      cy.get('button').contains('Reset Scores').click()
      cy.get('select').first().select('25 Points (High Fantasy)')
      cy.get('button').contains('Quick Set (All 14s)').click()
      
      cy.get('select').first().should('have.value', '30')
      cy.get('button').contains('Next').should('not.be.disabled')
    })
  })

  describe('localStorage Reset Feature', () => {
    it('should clear all data when reset button is clicked', () => {
      // Create some character data
      cy.get('button').contains('Quick Set (All 14s)').click()
      cy.get('button').contains('Next').click()
      
      cy.get('input[value="STR"][type="radio"]').click()
      
      // Verify data exists in localStorage
      cy.window().its('localStorage').invoke('getItem', 'characterData').should('exist')

      // Click reset button
      cy.get('button').contains('Reset Data').click()
      
      // Confirm the dialog
      cy.on('window:confirm', () => true)
      
      // Page should reload and data should be gone
      cy.window().its('localStorage').invoke('getItem', 'characterData').should('not.exist')
      
      // Should be back on main page or step 1
      cy.get('h2').contains('Determine Ability Scores').should('be.visible')
    })
  })
})