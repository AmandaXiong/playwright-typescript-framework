import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { users } from '../../src/data/users';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('shows 6 products', async () => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sorts products by price, low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('adding a product updates the cart badge', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});