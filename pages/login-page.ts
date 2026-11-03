import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly getRegisterButton: Locator;
    readonly getLoginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = page.getByRole('textbox', { name: 'Email:' });
        this.password = page.getByRole('textbox', { name: 'Password:' });
        this.getRegisterButton = page.getByRole('button', { name: 'Register' });
        this.getLoginButton = page.getByRole('button', { name: 'Log in' });
        this.errorMessage = page.locator('div.validation-summary-errors');
    }

    async clickRegisterButton() {
        await this.getRegisterButton.click();
    }

    async clickLoginButton() {
        await this.getLoginButton.click();
    }

    async login(email: string, password: string) {
        //Login with the correct credentials 
        await this.email.fill(email);
        await this.password.fill(password);
        await this.clickLoginButton();
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
