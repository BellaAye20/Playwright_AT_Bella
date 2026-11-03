import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import RegisterPage from '../pages/register-page';


test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page); 
  await homePage.gotoDemo();   

  //Click LogIn Menu
  await homePage.clickLoginLink();   
  //Click  Register button
  await homePage.clickRegister();
});

test('register existing user', async ({ page }) => {
  const registerPage = new RegisterPage(page);
    
  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  //Fill the register form 
  await registerPage.register('Female', 'Bella', 'Aye', 'bella@gmail.com', 'test12345', 'test12345');

  //Verify that register is successful
  await expect(page.getByText('The specified email already exists')).toBeVisible();
});

test('register new user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  //Fill the register form 
  const uniqueEmail = `bella.aye_${Date.now()}@yopmail.com`;
  await registerPage.register('Female', 'Bella', 'Aye', uniqueEmail, 'bella12345', 'bella12345');

  //Verify that register is successful
  await expect(page.getByText('Your registration completed')).toBeVisible();

  //Click Log out Menu
  await loginPage.clickLogout();
});
