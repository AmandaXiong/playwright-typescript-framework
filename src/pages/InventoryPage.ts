import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly items: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly sortDropdown: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
        this.itemNames = page.getByTestId('inventory-item-name');
        this.itemPrices = page.getByTestId('inventory-item-price');
        this.sortDropdown = page.getByTestId('product-sort-container');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartLink = page.getByTestId('shopping-cart-link');
    }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectOption(option);
    }

    async addToCart(productId: string) {
        await this.page.getByTestId(`add-to-cart-${productId}`).click();
    }
    async goToCart() {
        await this.cartLink.click();
    }
    async getPrices(): Promise<number[]> {
        const texts = await this.itemPrices.allTextContents();
        return texts.map((t) => Number(t.replace('$', '')));
    }

}

 