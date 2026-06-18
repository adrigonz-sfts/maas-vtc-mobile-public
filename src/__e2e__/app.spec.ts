import { test, expect } from '@playwright/test';

test.describe('App', () => {
    test('should load the application', async ({ page }) => {
        await page.goto('/');

        // Verify the app container is visible
        const appContainer = page.locator('#app');
        await expect(appContainer).toBeVisible();
    });

    test('should have correct page title', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle(/fake_front_test/);
    });
});
