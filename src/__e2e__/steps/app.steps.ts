import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, Then } = createBdd();

Given('I open the app', async ({ page }) => {
    await page.goto('/');
});

Then('the app container is visible', async ({ page }) => {
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeAttached();
});

Then('the page title contains {string}', async ({ page }, titlePart: string) => {
    await expect(page).toHaveTitle(new RegExp(titlePart));
});
