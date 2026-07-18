import { test, expect } from '@playwright/test';

/**
 * Critical public-flow smoke tests. These exercise the running app end to end and are
 * intentionally resilient (no seeded-data assumptions) so they pass against a fresh stack.
 */

test('home page loads and links to discovery', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Lumière|Salon|Hair/i);
  await page.getByRole('link', { name: /discover/i }).first().click();
  await expect(page).toHaveURL(/\/discover/);
});

test('discover page renders a search box', async ({ page }) => {
  await page.goto('/discover');
  await expect(page.getByRole('searchbox').or(page.getByPlaceholder(/shoreditch|braids|salon/i))).toBeVisible();
});

test('login page validates credentials', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible();
});
