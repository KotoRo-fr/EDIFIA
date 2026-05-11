import { test, expect } from '@playwright/test';

test.describe('Conformite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'demo@edifia.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/.*dashboard.*/);
  });

  test('page conformite affiche score et table', async ({ page }) => {
    await page.goto('/#/compliance/proj-3');
    await expect(page.locator('text=Conformite reglementaire')).toBeVisible();
    await expect(page.locator('text=Conformite globale')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('filtres de categorie fonctionnent', async ({ page }) => {
    await page.goto('/#/compliance/proj-3');
    await page.selectOption('select:first-of-type', 're2020');
    // Les resultats devraient etre filtres
    await expect(page.locator('text=RE2020')).toBeVisible();
  });
});
