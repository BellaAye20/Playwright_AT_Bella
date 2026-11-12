import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import RegisterPage from '../pages/register-page';
import { createUniqueUser } from '../test-data/users';

test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page); 
  await homePage.gotoDemo();

});

test('login with incorrect credentials - email', async ({ page }) => {
  const loginPage = new LoginPage(page);    
  const homePage = new HomePage(page);
  
  //Navigate to the login page
  await homePage.clickLoginLink();

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
  const registerPage = new RegisterPage(page);

  //Navigate to Register page
  await homePage.clickRegisterLink();

  //Create new user
  const user = createUniqueUser();
  await registerPage.register(user.gender, user.firstName, user.lastName, user.email, user.password, user.password);

  //Click Log out Menu
  await homePage.clickLogoutLink();

  //Navigate to login page
  await homePage.clickLoginLink();

  //Use correct email but incorrect password
  await loginPage.login(user.email,'wrongpassword');
  
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
  const registerPage = new RegisterPage(page);
  
  //Navigate to Register page
  await homePage.clickRegisterLink();

  //Create new user
  const user = createUniqueUser();
  await registerPage.register(user.gender, user.firstName, user.lastName, user.email, user.password, user.password);

  //Click Log out Menu
  await homePage.clickLogoutLink();

  //Navigate to login page
  await homePage.clickLoginLink();

  //Login with the correct credentials 
  await loginPage.login(user.email, user.password);

  //Verify that login is successful
  await expect(page.getByRole('heading', { name: 'Welcome to our store' })).toBeVisible();
  await expect(homePage.getEmailLink).toContainText(user.email);
  await expect(homePage.getLogoutLink).toBeVisible();  
  
  //Click Log out
  await homePage.clickLogoutLink();
});
