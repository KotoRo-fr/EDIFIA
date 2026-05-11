import { test, expect } from '@playwright/test';

test.describe('Programmation et Conception', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'demo@edifia.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/.*dashboard.*/);
  });

  test('page programmation affiche 5 onglets', async ({ page }) => {
    await page.goto('/#/programming/proj-3');
    await expect(page.locator('text=Programmation architecturale')).toBeVisible();
    await expect(page.locator('text=CHA')).toBeVisible();
    await expect(page.locator('text=CAO')).toBeVisible();
  });

  test('page conception affiche 4 variantes', async ({ page }) => {
    await page.goto('/#/design/proj-3');
    await expect(page.locator('text=Conception generative')).toBeVisible();
    await expect(page.locator('text=Variante')).toBeVisible();
  });
});
