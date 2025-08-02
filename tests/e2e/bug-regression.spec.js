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
      await expect(page.locator('text=All Known Languages: 1')).toBeVisible();

      // After selecting first bonus language
      await page.click('input[type="checkbox"][value="Draconic"]');
      await expect(page.locator('text=All Known Languages: 2')).toBeVisible();

      // After selecting second bonus language
      await page.click('input[type="checkbox"][value="Elven"]');
      await expect(page.locator('text=All Known Languages: 3')).toBeVisible();

      // Deselecting should decrease count
      await page.click('input[type="checkbox"][value="Draconic"]');
      await expect(page.locator('text=All Known Languages: 2')).toBeVisible();
    });

    test('should work correctly with Elf and high INT modifier', async ({ page }) => {
      // Set up custom ability scores with high INT for Elf
      await page.selectOption('select', '30 Points (Epic Fantasy)');
      
      // Set high INT to 16 (+3 modifier) by clicking + button multiple times
      const intRow = page.locator('tr:has-text("INT")');
      for (let i = 0; i < 6; i++) {
        await intRow.locator('button:has-text("+")').click();
      }
      
      // Decrease other abilities to balance points
      const strRow = page.locator('tr:has-text("STR")');
      for (let i = 0; i < 3; i++) {
        await strRow.locator('button:has-text("-")').click();
      }
      const dexRow = page.locator('tr:has-text("DEX")');
      for (let i = 0; i < 3; i++) {
        await dexRow.locator('button:has-text("-")').click();
      }
      
      await page.click('text=Next');

      // Select Elf (gets Elven automatic + INT bonus languages)
      await page.click('input[value="Elf"][type="radio"]');

      // Should need 2 automatic (Common, Elven) + 3 bonus from INT = 5 total
      // Initially should show 2 (Common + Elven)
      await expect(page.locator('text=All Known Languages: 2')).toBeVisible();

      // Select 3 bonus languages
      await page.click('input[type="checkbox"][value="Draconic"]');
      await expect(page.locator('text=All Known Languages: 3')).toBeVisible();
      
      await page.click('input[type="checkbox"][value="Celestial"]');
      await expect(page.locator('text=All Known Languages: 4')).toBeVisible();
      
      await page.click('input[type="checkbox"][value="Gnome"]');
      await expect(page.locator('text=All Known Languages: 5')).toBeVisible();

      // Now Next button should be enabled
      await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    });
  });

  test.describe('Point Buy Quick Set Bug', () => {
    test('should enable Next button after Quick Set regardless of point buy system', async ({ page }) => {
      // Test with default 20-point system
      await expect(page.locator('select').first()).toHaveValue('20');
      await page.click('text=Quick Set (All 14s)');
      
      // Should automatically switch to 30-point system and enable Next
      await expect(page.locator('select').first()).toHaveValue('30');
      await expect(page.locator('text=Remaining Points: 0')).toBeVisible();
      await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    });

    test('should work with any point buy system', async ({ page }) => {
      // Test with 15-point system
      await page.selectOption('select', '15 Points (Low Fantasy)');
      await page.click('text=Quick Set (All 14s)');
      
      // Should switch to 30-point and work
      await expect(page.locator('select').first()).toHaveValue('30');
      await expect(page.locator('text=Remaining Points: 0')).toBeVisible();
      await expect(page.locator('button:has-text("Next")')).toBeEnabled();

      // Reset and test with 25-point
      await page.click('text=Reset Scores');
      await page.selectOption('select', '25 Points (High Fantasy)');
      await page.click('text=Quick Set (All 14s)');
      
      await expect(page.locator('select').first()).toHaveValue('30');
      await expect(page.locator('button:has-text("Next")')).toBeEnabled();
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