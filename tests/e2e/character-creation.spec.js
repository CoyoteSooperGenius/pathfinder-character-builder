import { test, expect } from '@playwright/test';

test.describe('Character Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create Character');
  });

  test('should complete full character creation with Human Fighter', async ({ page }) => {
    // Step 1: Ability Scores - Select Point Buy and use Quick Set
    await expect(page.locator('h2')).toContainText('Determine Ability Scores');
    await page.selectOption('#ability-method', 'Point Buy');
    await page.click('text=Quick Set (All 14s)');
    
    // Verify ability scores are set - check that table rows contain 14
    await expect(page.locator('tbody tr')).toHaveCount(6);
    const rows = page.locator('tbody tr');
    for (let i = 0; i < 6; i++) {
      await expect(rows.nth(i)).toContainText('14');
    }
    
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 2: Race Selection - Human with customizations
    await expect(page.locator('h2')).toContainText('Pick Your Race');
    
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
    await expect(page.locator('text=All Known Languages: 3')).toBeVisible();
    
    // Next button should be enabled
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 3: Class Selection - Fighter
    await expect(page.locator('h2')).toContainText('Pick Your Class');
    
    // Select Fighter
    await page.click('input[value="Fighter"][type="radio"]');
    
    // Select bonus feat
    await page.selectOption('select', 'Power Attack');
    
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 4-7: Navigate through remaining steps (placeholders)
    await expect(page.locator('h2')).toContainText('Pick Skills');
    await page.click('text=Next');

    await expect(page.locator('h2')).toContainText('Pick Feats');
    await page.click('text=Next');

    await expect(page.locator('h2')).toContainText('Buy Equipment');
    await page.click('text=Next');

    await expect(page.locator('h2')).toContainText('Finishing Details');
    await page.click('text=Finish');

    // Verify we're on the character sheet
    await expect(page.locator('h3')).toContainText('Character Sheet');
    
    // Verify character data
    await expect(page.locator('text=Human')).toBeVisible();
    await expect(page.locator('text=Fighter')).toBeVisible();
    await expect(page.locator('text=STR: 15')).toBeVisible(); // 14 + 1 racial
    await expect(page.locator('text=Draconic')).toBeVisible();
    await expect(page.locator('text=Elven')).toBeVisible();
  });

  test('should prevent progression with incomplete steps', async ({ page }) => {
    // Step 1: Try to proceed without setting ability scores
    await expect(page.locator('h2')).toContainText('Determine Ability Scores');
    await expect(page.locator('button:has-text("Next")')).toBeDisabled();
    
    // Complete ability scores
    await page.selectOption('#ability-method', 'Point Buy');
    await page.click('text=Quick Set (All 14s)');
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.click('text=Next');

    // Step 2: Try to proceed without completing race selections
    await expect(page.locator('h2')).toContainText('Pick Your Race');
    
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

  test('should maintain character data in localStorage', async ({ page }) => {
    // Complete first two steps
    await page.selectOption('#ability-method', 'Point Buy');
    await page.click('text=Quick Set (All 14s)');
    await page.click('text=Next');
    
    await page.click('input[value="STR"][type="checkbox"]');
    await page.click('input[value="Fighter"][type="radio"]');
    await page.click('input[type="checkbox"][value="Draconic"]');
    await page.click('input[type="checkbox"][value="Elven"]');
    await page.click('text=Next');

    // Refresh page and verify data persists
    await page.reload();
    await page.waitForTimeout(1000); // Wait for Vue to reinitialize
    
    // Should be on step 3 (class selection)
    await expect(page.locator('h2')).toContainText('Pick Your Class');
    
    // Character sheet should show previous selections
    await expect(page.locator('text=Human')).toBeVisible();
    await expect(page.locator('text=STR: 15')).toBeVisible();
  });
});