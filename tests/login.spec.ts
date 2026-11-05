import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';


test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page); 
  await homePage.gotoDemo();

  //Navigate to the login page
  await homePage.clickLoginLink();
});

test('login with incorrect credentials - email', async ({ page }) => {
  const loginPage = new LoginPage(page);    
  const homePage = new HomePage(page);
  
  //Enter unregistered email address and some password
  await loginPage.login('incorrect@yopmail.com','gs123456');
  
  //Verify that the expected login error is displayed
  await expect(loginPage.errorMessage).toContainText('Login was unsuccessful. Please correct the errors and try again.');
  await expect(loginPage.errorMessage).toContainText('No customer account found');

  //Verify that the user remains logged out
  await expect(homePage.getRegisterLink).toBeVisible();
  await expect(homePage.getLoginLink).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Welcome, Please Sign In!' })).toBeVisible();
});

test('login with incorrect credentials - password', async ({ page }) => {
  const loginPage = new LoginPage(page);    
  const homePage = new HomePage(page); 
  //Enter a registered email address and an incorrect password
  await loginPage.login('bella.aye@gmail.com','incorrect');
  
  //Verify that the expected login error is displayed
  await expect(loginPage.errorMessage).toContainText('Login was unsuccessful. Please correct the errors and try again.');
  await expect(loginPage.errorMessage).toContainText('The credentials provided are incorrect');

  //Verify that the user remains logged out
  await expect(homePage.getRegisterLink).toBeVisible();
  await expect(homePage.getLoginLink).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Welcome, Please Sign In!' })).toBeVisible();
});

test('valid login with correct credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page); 

  //Login with the correct credentials 
  await loginPage.login('bella.aye@gmail.com','gs123456');

  //Verify that login is successful
  await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();
  await expect(homePage.getEmailLink).toContainText('bella.aye@gmail.com');
  await expect(homePage.getLogoutLink).toBeVisible();  
  
  //Click Log out
  await homePage.clickLogoutLink();
});
