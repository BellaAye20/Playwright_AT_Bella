import { type Locator, type Page } from '@playwright/test';

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

    constructor(page: Page) {
        this.page = page;
        this.getPageSize = page.locator('#products-pagesize');
        this.getRemoveFilter = page.getByRole('link', { name: 'Remove Filter' });
        this.getGotoCart = page.getByRole('button', { name: 'Go to cart' });
        this.getAddWishlist = page.getByRole('button', { name: 'Add to wishlist' });
        this.getUpdateShoppingCart = page.getByRole('button', { name: 'Update shopping cart' });
        this.getContinueShopping = page.getByRole('button', { name: 'Continue shopping' });
        this.getEstimateShipping = page.getByRole('button', { name: 'Estimate shipping' });
        this.shoppingMessage = page.locator('div.order-summary-content');
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
        const cartItems = this.page.locator('table.cart tr.cart-item-row');
        let count = await cartItems.count();
        if (count > 0) {
            for (const cartItem of await cartItems.all()) {
                await cartItem.locator('td.remove-from-cart input[type="checkbox"]').click();
            }
            await this.page.getByRole('button', { name: 'Update shopping cart' }).click();
        }
    }
 
}

export default ShoppingPage;