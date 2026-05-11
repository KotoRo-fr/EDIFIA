import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'demo@edifia.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/.*dashboard.*/);
  });

  test('affiche 10 projets', async ({ page }) => {
    const cards = page.locator('[data-testid="project-card"]');
    await expect(cards).toHaveCount(10);
  });

  test('stats cards visibles', async ({ page }) => {
    await expect(page.locator('text=Projets total')).toBeVisible();
    await expect(page.locator('text=Actifs')).toBeVisible();
  });

  test('navigation vers projet', async ({ page }) => {
    await page.click('[data-testid="project-card"]:first-child');
    await expect(page).toHaveURL(/.*projects.*/);
    await expect(page.locator('text=Avancement du projet')).toBeVisible();
  });
});
