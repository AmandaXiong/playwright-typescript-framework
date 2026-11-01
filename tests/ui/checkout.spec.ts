import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { users } from '../../src/data/users';
import { customer } from '../../src/data/customer';

test.describe('Checkout', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await cartPage.checkoutButton.click();
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('user can complete a purchase', async () => {
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');

    await checkoutPage.finishButton.click();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('shows an error when first name is missing', async () => {
    await checkoutPage.fillInformation('', customer.lastName, customer.postalCode);
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('order total equals item total plus tax', async () => {
    await checkoutPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);

    const subtotal = await checkoutPage.getAmount(checkoutPage.subtotalLabel);
    const tax = await checkoutPage.getAmount(checkoutPage.taxLabel);
    const total = await checkoutPage.getAmount(checkoutPage.totalLabel);

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});