import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';


test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page); 
  await homePage.gotoDemo();

  //Navigate to the login page
  await homePage.clickLoginLink();
});

test('login with incorrect credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);    

  //Enter a registered email address and an incorrect password
  await page.getByRole('textbox', { name: 'Email:' }).fill('bella@gmail.com');
  await page.getByRole('textbox', { name: 'Password:' }).fill('incorrect');

  //Click Log in button
  await loginPage.clickLoginButton();
  
  //Verify that the expected login error is displayed
  await expect(page.getByText('Login was unsuccessful. Please correct the errors and try again.')).toBeVisible();
  await expect(page.getByText('The credentials provided are incorrect')).toBeVisible();
  //Verify that the user remains logged out
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Welcome, Please Sign In!' })).toBeVisible();
});

test('valid login with correct credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //Login with the correct credentials 
  await page.getByRole('textbox', { name: 'Email:' }).fill('bella.aye@gmail.com');
  await page.getByRole('textbox', { name: 'Password:' }).fill('gs123456');
  await page.getByRole('button', { name: 'Log in' }).click();

  //Verify that login is successful
  await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'bella.aye@gmail.com' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();  
  
  //Click Log out
  await loginPage.clickLogout();
});
