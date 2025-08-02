import { test, expect } from '@playwright/test';

test.describe('Bug Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Create Character');
  });

  test.describe('Race Selection Step Completion Bug', () => {
    test('should enable Next button only when all race requirements are met', async ({ page }) => {
      // Complete ability scores first
      await page.selectOption('#ability-method', 'Point Buy');
      await page.click('text=Quick Set (All 14s)');
      await page.click('text=Next');

      // Initially Next should be disabled
      await expect(page.locator('button:has-text("Next")')).toBeDisabled();

      // Select race (Human is default)
      await expect(page.locator('input[value="Human"][type="radio"]')).toBeChecked();
      await expect(page.locator('button:has-text("Next")')).toBeDisabled();

      // Select ability increase
      await page.click('input[value="STR"][type="checkbox"]');
      await expect(page.locator('button:has-text("Next")')).toBeDisabled();

      // Select favored class
      await page.click('input[value="Fighter"][type="radio"]');
      await expect(page.locator('button:has-text("Next")')).toBeDisabled();

      // Select first bonus language
      await page.click('input[type="checkbox"][value="Draconic"]');
      await expect(page.locator('button:has-text("Next")')).toBeDisabled();

      // Select second bonus language - NOW Next should enable
      await page.click('input[type="checkbox"][value="Elven"]');
      await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    });

    test('should update language count display correctly', async ({ page }) => {
      // Complete ability scores first
      await page.selectOption('#ability-method', 'Point Buy');
      await page.click('text=Quick Set (All 14s)');
      await page.click('text=Next');

      // Initially should show 1 language (Common)
      await expect(page.locator('text=Total: 1')).toBeVisible();

      // After selecting first bonus language
      await page.click('input[type="checkbox"][value="Draconic"]');
      await expect(page.locator('text=Total: 2')).toBeVisible();

      // After selecting second bonus language
      await page.click('input[type="checkbox"][value="Elven"]');
      await expect(page.locator('text=Total: 3')).toBeVisible();

      // Deselecting should decrease count
      await page.click('input[type="checkbox"][value="Draconic"]');
      await expect(page.locator('text=Total: 2')).toBeVisible();
    });

  });

  test.describe('Point Buy Quick Set Bug', () => {
    test('should enable Next button after Quick Set regardless of point buy system', async ({ page }) => {
      // Test with default 20-point system
      await page.selectOption('#ability-method', 'Point Buy');
      await page.click('text=Quick Set (All 14s)');
      
      // Should automatically switch to 30-point system and enable Next
      await expect(page.locator('text=Remaining Points: 0')).toBeVisible();
      await expect(page.locator('id=next-button')).toBeEnabled();
    });

    test('should work with any point buy system', async ({ page }) => {
      // Test with 15-point system
      await page.selectOption('#ability-method', 'Point Buy');
      await page.selectOption('#point-buy-total', '15 Points (Low Fantasy)');
      await page.click('text=Quick Set (All 14s)');
      
      // Should switch to 30-point and work
      await expect(page.locator('text=Remaining Points: 0')).toBeVisible();
      await expect(page.locator('id=next-button')).toBeEnabled();

      // Reset and test with 25-point
      await page.click('text=Reset Scores');
      await page.selectOption('#point-buy-total', '25 Points (High Fantasy)');
      await page.click('text=Quick Set (All 14s)');
      
      await expect(page.locator('text=Remaining Points: 0')).toBeVisible();
      await expect(page.locator('id=next-button')).toBeEnabled();
    });
  });

  test.describe('localStorage Reset Feature', () => {
    test('should clear all data when reset button is clicked', async ({ page }) => {
      // Create some character data
      await page.selectOption('#ability-method', 'Point Buy');
      await page.click('text=Quick Set (All 14s)');
      await page.click('text=Next');
      
      await page.click('input[value="STR"][type="checkbox"]');
      
      // Verify data exists in localStorage by checking if we can navigate
      await expect(page.locator('input[value="STR"][type="checkbox"]')).toBeChecked();

      // Click reset button and handle the confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      await page.click('text=Reset Data');
      
      // Page should reload and we should be back on the main page
      await expect(page.locator('text=Create Character')).toBeVisible();
    });
  });
});