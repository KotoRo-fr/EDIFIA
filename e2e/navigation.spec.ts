import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('sidebar navigation fonctionne', async ({ page }) => {
    await page.goto('/#/login');
    await page.fill('input[type="email"]', 'demo@edifia.fr');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/.*dashboard.*/);
    
    // Sidebar links
    await page.click('text=Parametres');
    await expect(page).toHaveURL(/.*settings.*/);
    
    await page.click('text=Tableau de bord');
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('404 redirige vers home', async ({ page }) => {
    await page.goto('/#/nonexistent');
    await expect(page).toHaveURL(/.*\/#\//);
  });
});
