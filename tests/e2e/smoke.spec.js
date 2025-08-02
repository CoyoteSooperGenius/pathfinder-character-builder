import { test, expect } from '@playwright/test';

test.describe('Application Smoke Tests', () => {
  test('application loads and basic workflow works', async ({ page }) => {
    // Test 1: Main page loads
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Pathfinder 1st Edition Character Generator');
    await expect(page.locator('text=Create Character')).toBeVisible();

    // Test 2: Can start character creation
    await page.click('text=Create Character');
    await expect(page.locator('.stepper h2')).toContainText('Determine Ability Scores');

    // Test 3: Can select Point Buy method
    await page.selectOption('#ability-method', 'Point Buy');
    await expect(page.locator('text=Quick Set (All 14s)')).toBeVisible();

    // Test 4: Quick Set works
    await page.click('text=Quick Set (All 14s)');
    await expect(page.locator('text=Remaining Points: 0')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();

    // Test 5: Can proceed to race selection
    await page.click('button:has-text("Next")');
    await expect(page.locator('.stepper h2')).toContainText('Pick Your Race');

    // Test 6: Human is selected by default
    await expect(page.locator('input[value="Human"][type="radio"]')).toBeChecked();

    // Test 7: Reset button exists and works
    await page.click('text=Reset Data');
    await page.on('dialog', dialog => dialog.accept());
    await expect(page.locator('text=Create Character')).toBeVisible();
  });

  test('unit test coverage validates core logic', async ({ page }) => {
    // This test documents that we have comprehensive unit test coverage
    // for the business logic, so E2E tests focus on integration only
    
    await page.goto('/');
    
    // Verify core services are loaded and available
    const hasAbilityCalculator = await page.evaluate(() => {
      return typeof window.AbilityCalculator !== 'undefined';
    });
    expect(hasAbilityCalculator).toBe(true);

    const hasLanguageData = await page.evaluate(() => {
      return typeof window.LanguageData !== 'undefined';
    });
    expect(hasLanguageData).toBe(true);

    // Verify basic calculations work in browser
    const modifier = await page.evaluate(() => {
      return window.AbilityCalculator.getModifier(14);
    });
    expect(modifier).toBe(2);

    const languages = await page.evaluate(() => {
      return window.LanguageData.getAutomaticLanguages('Human');
    });
    expect(languages).toEqual(['Common']);
  });

  test('localStorage functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Create some test data
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
    });

    // Verify it persists
    const value = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    expect(value).toBe('test-value');

    // Test reset functionality
    await page.click('text=Reset Data');
    await page.on('dialog', dialog => dialog.accept());
    
    // Should clear localStorage
    const clearedValue = await page.evaluate(() => {
      return localStorage.getItem('test-key');
    });
    expect(clearedValue).toBeNull();
  });
});