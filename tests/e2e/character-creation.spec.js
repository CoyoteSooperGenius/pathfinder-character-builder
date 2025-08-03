import { test, expect } from '@playwright/test';

test.describe('Character Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create Character');
  });

  test('should complete full character creation with Human Fighter', async ({ page }) => {
    // Step 1: Ability Scores - Select Point Buy and use Quick Set
    await expect(page.locator('id=step-title')).toContainText('Determine Ability Scores');
    await page.selectOption('#ability-method', 'Point Buy');
    await page.click('text=Quick Set (All 14s)');
    
    // Verify ability scores are set - check point-buy table specifically
    const pointBuyTable = page.locator('.ability-score-adjuster table tbody');
    await expect(pointBuyTable.locator('tr')).toHaveCount(6);
    const rows = pointBuyTable.locator('tr');
    for (let i = 0; i < 6; i++) {
      await expect(rows.nth(i)).toContainText('14');
    }
    
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 2: Race Selection - Human with customizations
    await expect(page.locator('id=step-title')).toContainText('Pick Your Race');

    // Human should be selected by default
    await expect(page.locator('input[value="Human"][type="radio"]')).toBeChecked();
    
    // Select STR increase (checkbox for humans)
    await page.click('input[value="STR"][type="checkbox"]');
    
    // Select Fighter as favored class
    await page.click('input[value="Fighter"][type="radio"]');
    
    // Select 2 bonus languages (Human with +2 INT gets Common + 2 bonus)
    await page.click('input[type="checkbox"][value="Draconic"]');
    await page.click('input[type="checkbox"][value="Elven"]');
    
    // Verify language count updates
    await expect(page.locator('text=Total: 3')).toBeVisible();
    
    // Next button should be enabled
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 3: Class Selection - Fighter
    await expect(page.locator('id=step-title')).toContainText('Pick Your Class');

    // Select Fighter
    await page.click('id=Fighter-selector');

    // Select bonus feat
    await page.click('h6:has-text("Dodge")');

    await expect(page.locator('id=next-button')).toBeEnabled();
    await page.click('text=Next');

    // Step 4-7: Navigate through remaining steps (placeholders)
    await expect(page.locator('id=step-title')).toContainText('Pick Skills');
    await page.click('text=Next');

    await expect(page.locator('id=step-title')).toContainText('Pick Feats');
    await page.click('text=Next');

    await expect(page.locator('id=step-title')).toContainText('Buy Equipment');
    await page.click('text=Next');

    await expect(page.locator('id=step-title')).toContainText('Finishing Details');
    await page.click('text=Finish');

    // Verify character data
    await expect(page.locator('id=character-sheet-race')).toContainText('Human');
    //await expect(page.locator('id=character-sheet-class')).toContainText('Fighter');
    await expect(page.locator('id=character-sheet-str')).toContainText('16'); // 14 + 2 racial
    await expect(page.locator('id=character-sheet-languages')).toContainText('Draconic');
    await expect(page.locator('id=character-sheet-languages')).toContainText('Elven');
  });

  test('should prevent progression with incomplete steps', async ({ page }) => {
    // Step 1: Try to proceed without setting ability scores
    await expect(page.locator('id=step-title')).toContainText('Determine Ability Scores');
    await expect(page.locator('button:has-text("Next")')).toBeDisabled();
    
    // Complete ability scores
    await page.selectOption('#ability-method', 'Point Buy');
    await page.click('text=Quick Set (All 14s)');
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 2: Try to proceed without completing race selections
    await expect(page.locator('id=step-title')).toContainText('Pick Your Race');

    // Only select ability increase, not favored class or languages
    await page.click('input[value="STR"][type="checkbox"]');
    await expect(page.locator('button:has-text("Next")')).toBeDisabled();
    
    // Add favored class but not languages
    await page.click('input[value="Fighter"][type="radio"]');
    await expect(page.locator('button:has-text("Next")')).toBeDisabled();
    
    // Add required languages
    await page.click('input[type="checkbox"][value="Draconic"]');
    await page.click('input[type="checkbox"][value="Elven"]');
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
  });
});