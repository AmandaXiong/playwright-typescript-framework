import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { users } from '../../src/data/users';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  test('added product appears in the cart', async () => {
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText('Sauce Labs Backpack');
  });

  test('removing a product empties the cart', async () => {
    await cartPage.removeItem('sauce-labs-backpack');
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('continue shopping returns to the products page', async ({ page }) => {
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});