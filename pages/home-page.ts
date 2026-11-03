import { type Locator, type Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly getRegisterLink: Locator;
    readonly getLoginLink: Locator;
    readonly getEmailLink: Locator;
    readonly getLogoutLink: Locator;
    readonly getShoppingCartLink: Locator;
    readonly getWishlistLink: Locator;
    readonly getSearchBox: Locator;
    readonly getSearchButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.getRegisterLink = page.getByRole('link', { name: 'Register' });
        this.getLoginLink = page.getByRole('link', { name: 'Log in' });
        this.getEmailLink = page.locator('a.account').first();
        this.getLogoutLink = page.getByRole('link', { name: 'Log out' });
        this.getShoppingCartLink = page.locator('#topcartlink');
        this.getWishlistLink = page.locator('a.ico-wishlist').first();
        this.getSearchBox = page.locator('input.search-box-text ');
        this.getSearchButton = page.getByRole('button', { name: 'Register' });
    }

    async gotoDemo() {
        await this.page.goto('https://demowebshop.tricentis.com/');
    }

    async clickRegisterLink() {
        await this.getRegisterLink.click();
    }

    async clickLoginLink() {
        await this.getLoginLink.click();
    }

    async clickEmailLink() {
        await this.getEmailLink.click();
    }

    async clickLogoutLink() {
        await this.getLogoutLink.click();
    }

    async clickShoppingCartLink() {
        await this.getShoppingCartLink.click();
    }

    async clickWishlistLink() {
        await this.getWishlistLink.click();
    }

    async clickSearchButton() {
        await this.getSearchButton.click();
    }
    
}

export default HomePage;
