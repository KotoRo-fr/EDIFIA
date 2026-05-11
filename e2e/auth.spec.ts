import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('login mock fonctionne et redirige vers dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EDIFIA/);
    // Clic sur "Tableau de bord" navigue vers login
    await page.click('text=Tableau de bord');
    await expect(page).toHaveURL(/.*login.*/);
    // Login avec donnees mock
    await page.fill('input[type="email"]', 'demo@edifia.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Se connecter")');
    // Redirection vers dashboard
    await expect(page).toHaveURL(/.*dashboard.*/);
    await expect(page.locator('text=Mes Projets')).toBeVisible();
  });

  test('logout fonctionne', async ({ page }) => {
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'demo@edifia.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/.*dashboard.*/);
    // Cliquer sur avatar → deconnexion
    await page.click('[data-testid="user-avatar"]');
    await page.click('text=Deconnexion');
    await expect(page).toHaveURL(/.*\/#\//);
  });
});
