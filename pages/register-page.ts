import { type Locator, type Page } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;
    readonly getRegisterButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.locator('#FirstName');
        this.lastName = page.locator('#LastName');
        this.email = page.locator('#Email');
        this.password = page.locator('#Password');
        this.confirmPassword = page.locator('#ConfirmPassword');
        this.getRegisterButton = page.getByRole('button', { name: 'Register' });
    }  
    
    async clickRegister() {
        await this.getRegisterButton.click();
    }

    async register(gender: 'Male' | 'Female', firstName: string, lastName: string, email: string, password: string, confirmPassword: string) {
        await this.page.getByRole('radio', { name: gender, exact: true }).check();
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
        await this.clickRegister();
    }   
 
}

export default RegisterPage;
