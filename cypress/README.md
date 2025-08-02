# Cypress Testing for Pathfinder Character Builder

## Setup

1. Make sure your development server is running on port 8080:
   ```bash
   npx http-server -p 8080
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

## Running Tests

### Interactive Mode (Recommended for Development)
```bash
npm run cypress:open
```
This opens the Cypress Test Runner where you can:
- See tests run in real-time in a browser
- Debug failing tests
- Develop new tests interactively

### Headless Mode (CI/Automated)
```bash
npm run cypress:run
```
Runs all tests in headless mode and outputs results to terminal.

## Test Structure

### `e2e/character-creation-flow.cy.js`
- **Full character creation flow**: Tests the complete happy path from ability scores to finished character
- **Step validation**: Ensures steps require proper completion before proceeding
- **localStorage persistence**: Verifies character data survives page refreshes

### `e2e/bug-regression-tests.cy.js`
- **Race selection completion bug**: Tests the specific bug we fixed with language validation
- **Traits display bug**: Ensures racial traits display correctly
- **Point buy quick set**: Verifies the convenience feature works properly
- **localStorage reset**: Tests the developer reset button

### Custom Commands (`support/`)
- `cy.completeAbilityScores()`: Quick helper to set up ability scores
- `cy.completeRaceSelection()`: Helper for race selection with Human+Fighter
- `cy.resetApp()`: Clears localStorage and reloads page
- `cy.verifyCharacterSheet()`: Validates character sheet data

## Test Data

The `fixtures/characters.json` file contains pre-defined character builds for testing different race/class combinations.

## Adding New Tests

1. **Component tests**: Add tests for individual Vue components
2. **Service tests**: Test the calculation and validation services
3. **Edge cases**: Test unusual combinations or error conditions
4. **Accessibility**: Test keyboard navigation and screen reader support

## Best Practices

- Use `data-cy` attributes for reliable element selection
- Clear localStorage between tests for consistent state
- Test both happy paths and error conditions
- Keep tests focused and independent
- Use custom commands for common actions