import { type Locator, type Page, expect } from '@playwright/test';

export class ShoppingPage {
    readonly page: Page;
    readonly getPageSize: Locator;
    readonly getRemoveFilter: Locator;
    readonly getGotoCart: Locator;
    readonly getAddWishlist: Locator;
    readonly getUpdateShoppingCart: Locator;
    readonly getContinueShopping: Locator;
    readonly getEstimateShipping: Locator;
    readonly shoppingMessage: Locator;
    readonly productItems: Locator;
    readonly cartItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.getPageSize = page.locator('#products-pagesize');
        this.getRemoveFilter = page.getByRole('link', { name: 'Remove Filter' });
        this.getGotoCart = page.locator('input.cart-button');
        this.getAddWishlist = page.getByRole('button', { name: 'Add to wishlist' });
        this.getUpdateShoppingCart = page.getByRole('button', { name: 'Update shopping cart' });
        this.getContinueShopping = page.getByRole('button', { name: 'Continue shopping' });
        this.getEstimateShipping = page.getByRole('button', { name: 'Estimate shipping' });
        this.shoppingMessage = page.locator('div.order-summary-content');
        this.productItems = page.locator('div.product-grid div.product-item');
        this.cartItems = page.locator('table.cart tr.cart-item-row');
    }

    async clickGotoCart() {
        await this.getGotoCart.click();
    }

    async clickAddToWishlist() {
        await this.getAddWishlist.click();
    }

    async clickUpdateShoppingCart() {
        await this.getUpdateShoppingCart.click();
    }

    async clickContinueShopping() {
        await this.getContinueShopping.click();
    }

    async clickEstimateShipping() {
        await this.getEstimateShipping.click();
    }

    async clearShoppingCart() {
        await this.page.locator('#topcartlink').click();        
        //Wait until Shopping Cart page is displayed
        await expect(this.page.getByRole('heading', { name: 'Shopping cart' })).toBeVisible();
        const cartItems = this.cartItems;
        let count = await cartItems.count();
        if (count > 0) {
            for (const cartItem of await cartItems.all()) {
                await cartItem.locator('td.remove-from-cart input[type="checkbox"]').click();
            }
            await this.clickUpdateShoppingCart();
        }
    }

    async addDesktopProductToCart() {
        // await this.page.getByRole('link', { name: 'Computers' }).first().hover();
        // await this.page.getByRole('link', { name: 'Desktops' }).click();

        await this.page.getByRole('button', { name: 'Add to cart' }).first().click();
        await this.page.locator('#add-to-cart-button-72').click();
        await expect(this.page.locator('#bar-notification')).toContainText('The product has been added to your shopping cart');
        
        await this.page.getByRole('link', { name: 'Desktops' }).nth(1).click();
        await this.page.getByRole('button', { name: 'Add to cart' }).nth(1).click();        
        await this.page.getByRole('radio', { name: 'GB [+100.00]' }).check();
        await this.page.locator('#add-to-cart-button-16').click();
        await expect(this.page.locator('#bar-notification')).toContainText('The product has been added to your shopping cart');
        
        await this.page.getByRole('link', { name: 'Desktops' }).nth(1).click();
        await this.page.getByRole('button', { name: 'Add to cart' }).nth(2).click();
        await this.page.locator('#add-to-cart-button-74').click();
        await expect(this.page.locator('#bar-notification')).toContainText('The product has been added to your shopping cart');         
    }

}

export default ShoppingPage;