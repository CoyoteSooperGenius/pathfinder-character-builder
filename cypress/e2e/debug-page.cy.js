describe('Debug Page Content', () => {
  it('should show what is actually on the page', () => {
    cy.visit('/')
    
    // Log all text content
    cy.get('body').then(($body) => {
      console.log('Page content:', $body.text())
    })
    
    // Check if Create Character button exists
    cy.get('button').contains('Create Character').should('exist')
    cy.get('button').contains('Create Character').click()
    
    // Wait a bit for Vue to update
    cy.wait(1000)
    
    // Log what's on the page after clicking
    cy.get('body').then(($body) => {
      console.log('After clicking Create Character:', $body.text())
    })
    
    // Check all h1, h2, h3 elements
    cy.get('h1, h2, h3').each(($el) => {
      cy.log(`Found header: ${$el.text()}`)
    })
    
    // Check if stepper component loaded
    cy.get('body').should('contain', 'Step')
  })
})