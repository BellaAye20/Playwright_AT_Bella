import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import RegisterPage from '../pages/register-page';
import { createUniqueUser } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await homePage.gotoDemo();

  //Login with valid credentials
  await homePage.clickLoginLink();
  //Click  Register button
  await loginPage.clickRegisterButton();
});

test('register existing user', async ({ page }) => {
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);

  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  //First registration
  const user = createUniqueUser();
  await registerPage.register(user.gender, user.firstName, user.lastName, user.email, user.password, user.password);

  //Click Log out Menu
  await homePage.clickLogoutLink();

  //Try registering with the same email again as above
  await homePage.clickRegisterLink();

  await registerPage.register(user.gender, user.firstName, user.lastName, user.email, user.password, user.password);

  //Verify that register is successful
  await expect(registerPage.errorMessage).toHaveText("The specified email already exists");
});

test('register new user and login with registered credentials', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const registerPage = new RegisterPage(page);

  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

  //Create a unique user
  const user = createUniqueUser();

  await registerPage.register(user.gender, user.firstName, user.lastName, user.email, user.password, user.password);

  //Verify that register is successful
  await expect(registerPage.successMessage).toHaveText('Your registration completed');

  //Click Log out Menu
  await homePage.clickLogoutLink();

  //Login with registered credentials
  await homePage.clickLoginLink();
  await loginPage.login(user.email, user.password);

  // Verify successful login
  await expect(homePage.getEmailLink).toContainText(user.email);
  await expect(homePage.getLogoutLink).toBeVisible();
});

test('register new user - invalid data', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  //Fill invalid data in the register form 
  await registerPage.register('Female', 'User', '010', 'test@gmail.', '123456', '12345');

  //Verify that validation errors show at Email and Password fields 
  await expect(registerPage.fieldError.first()).toHaveText('Wrong email');
  await expect(registerPage.fieldError.nth(1)).toHaveText('The password and confirmation password do not match.');
});
