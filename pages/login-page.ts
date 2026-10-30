import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly getLoginButton: Locator;
    readonly getLogoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.getLoginButton = page.getByRole('button', { name: 'Log in' });
        this.getLogoutButton = page.getByRole('link', { name: 'Log out' });
    }

    async clickLoginButton() {
        await this.getLoginButton.click();
    }

    async clickLogout() {
        await this.getLogoutButton.click();
    }

    async login() {
        //Login with the correct credentials 
        await this.page.getByRole('textbox', { name: 'Email:' }).click();
        await this.page.getByRole('textbox', { name: 'Email:' }).fill('bella.aye@gmail.com');
        await this.page.getByRole('textbox', { name: 'Password:' }).click();
        await this.page.getByRole('textbox', { name: 'Password:' }).fill('gs123456');
        await this.getLoginButton.click();
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

    async clearWishlist() {
        await this.page.locator('a.ico-wishlist').first().click();
        const cartItems = this.page.locator('table.cart tr.cart-item-row');
        let count = await cartItems.count();
        if (count > 0) {
            for (const cartItem of await cartItems.all()) {
                await cartItem.locator('td.remove-from-cart input[type="checkbox"]').click();
            }
            await this.page.getByRole('button', { name: 'Update wishlist' }).click();
        } 
    }
}

export default LoginPage;
