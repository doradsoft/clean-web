const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Clean Web - Image Filter E2E Tests', () => {
  const testPagePath = 'file://' + path.resolve(__dirname, '../fixtures/test-page.html');

  test.beforeEach(async ({ page }) => {
    await page.goto(testPagePath);
  });

  test('should load the test page correctly', async ({ page }) => {
    await expect(page).toHaveTitle('Clean Web - Test Page');
    await expect(page.locator('h1')).toContainText('Clean Web - Image Filter Demo');
    
    // Check that images are loaded
    await expect(page.locator('#test-image-1')).toBeVisible();
    await expect(page.locator('#test-image-2')).toBeVisible();
    await expect(page.locator('#test-image-3')).toBeVisible();
  });

  test('should display initial statistics', async ({ page }) => {
    const statsContent = page.locator('#stats-content');
    await expect(statsContent).toContainText('Blocked: 0, Allowed: 0, Total: 0');
  });

  test('should block an image when block button is clicked', async ({ page }) => {
    // Click block button for first image
    await page.locator('button').filter({ hasText: 'Block This Image' }).first().click();
    
    // Check that image has blocked class
    await expect(page.locator('#test-image-1')).toHaveClass(/blocked/);
    
    // Check that stats are updated
    const statsContent = page.locator('#stats-content');
    await expect(statsContent).toContainText('Blocked: 1, Allowed: 0, Total: 1');
  });

  test('should allow a previously blocked image', async ({ page }) => {
    // First block an image
    await page.locator('button').filter({ hasText: 'Block This Image' }).first().click();
    await expect(page.locator('#test-image-1')).toHaveClass(/blocked/);
    
    // Then allow it
    await page.locator('button').filter({ hasText: 'Allow This Image' }).first().click();
    await expect(page.locator('#test-image-1')).not.toHaveClass(/blocked/);
    
    // Check that stats are updated
    const statsContent = page.locator('#stats-content');
    await expect(statsContent).toContainText('Blocked: 0, Allowed: 1, Total: 1');
  });

  test('should reset all filters', async ({ page }) => {
    // Block multiple images
    const blockButtons = page.locator('button').filter({ hasText: 'Block This Image' });
    await blockButtons.nth(0).click();
    await blockButtons.nth(1).click();
    
    // Verify images are blocked
    await expect(page.locator('#test-image-1')).toHaveClass(/blocked/);
    await expect(page.locator('#test-image-2')).toHaveClass(/blocked/);
    
    // Reset filters
    await page.locator('#reset-btn').click();
    
    // Verify images are unblocked
    await expect(page.locator('#test-image-1')).not.toHaveClass(/blocked/);
    await expect(page.locator('#test-image-2')).not.toHaveClass(/blocked/);
    
    // Verify stats are reset
    const statsContent = page.locator('#stats-content');
    await expect(statsContent).toContainText('Blocked: 0, Allowed: 0, Total: 0');
  });

  test('should update stats manually', async ({ page }) => {
    // Block an image
    await page.locator('button').filter({ hasText: 'Block This Image' }).first().click();
    
    // Click update stats button
    await page.locator('#update-stats-btn').click();
    
    // Verify stats are still correct
    const statsContent = page.locator('#stats-content');
    await expect(statsContent).toContainText('Blocked: 1, Allowed: 0, Total: 1');
  });

  test('should handle multiple image operations correctly', async ({ page }) => {
    const blockButtons = page.locator('button').filter({ hasText: 'Block This Image' });
    const allowButtons = page.locator('button').filter({ hasText: 'Allow This Image' });
    
    // Block first image
    await blockButtons.nth(0).click();
    await expect(page.locator('#stats-content')).toContainText('Blocked: 1, Allowed: 0, Total: 1');
    
    // Allow second image
    await allowButtons.nth(1).click();
    await expect(page.locator('#stats-content')).toContainText('Blocked: 1, Allowed: 1, Total: 2');
    
    // Block third image
    await blockButtons.nth(2).click();
    await expect(page.locator('#stats-content')).toContainText('Blocked: 2, Allowed: 1, Total: 3');
    
    // Allow first image (should change from blocked to allowed)
    await allowButtons.nth(0).click();
    await expect(page.locator('#stats-content')).toContainText('Blocked: 1, Allowed: 2, Total: 3');
  });

  test('should have proper visual feedback for blocked images', async ({ page }) => {
    const firstImage = page.locator('#test-image-1');
    
    // Initially, image should not be blocked
    await expect(firstImage).not.toHaveClass(/blocked/);
    
    // Block the image
    await page.locator('button').filter({ hasText: 'Block This Image' }).first().click();
    
    // Image should now have blocked class (which applies visual effects)
    await expect(firstImage).toHaveClass(/blocked/);
  });
});