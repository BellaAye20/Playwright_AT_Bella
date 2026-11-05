import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import RegisterPage from '../pages/register-page';


test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page); 
  const loginPage = new LoginPage(page);

  await Promise.all([
    await homePage.gotoDemo(),

    //Login with valid credentials
    await homePage.clickLoginLink(),
    //Click  Register button
    await loginPage.clickRegisterButton()
  ]);
});

test('register existing user', async ({ page }) => {
  const registerPage = new RegisterPage(page);
    
  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  //Fill the register form 
  await registerPage.register('Female', 'Bella', 'Aye', 'bella@gmail.com', 'test12345', 'test12345');

  //Verify that register is successful
  await expect(registerPage.errorMessage).toHaveText("The specified email already exists");
});

test('register new user', async ({ page }) => {
  const homePage = new HomePage(page); 
  const registerPage = new RegisterPage(page);

  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  //Fill the register form 
  const uniqueEmail = `bella.aye_${Date.now()}@yopmail.com`;
  await registerPage.register('Female', 'Bella', 'Aye', uniqueEmail, 'bella12345', 'bella12345');

  //Verify that register is successful
  await expect(registerPage.successMessage).toHaveText('Your registration completed');

  //Click Log out Menu
  await homePage.clickLogoutLink();
});

test('register new user - invalid data', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  //Fill invalid data in the register form 
  await registerPage.register('Female', 'User', '010', 'test@gmail.', '123456', '12345');

  //Verify that validation errors show at Email and Password fields 
  await expect(registerPage.fieldError.first()).toHaveText('Wrong email');
  await expect(registerPage.fieldError.nth(1)).toHaveText('The password and confirmation password do not match.');
});
