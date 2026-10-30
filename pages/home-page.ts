import { type Locator, type Page } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly getLoginLink: Locator;
    readonly getRegisterButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.getLoginLink = page.getByRole('link', { name: 'Log in' });
        this.getRegisterButton = page.getByRole('button', { name: 'Register' });
    }

    async gotoDemo() {
        await this.page.goto('https://demowebshop.tricentis.com/');
    }

    async clickLoginLink() {
        await this.getLoginLink.click();
    }

    async clickRegister() {
        await this.getRegisterButton.click();
    }
    
}

export default HomePage;