import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';


test.beforeEach(async ({page}) => {
  const homePage = new HomePage(page); 
  await homePage.gotoDemo();   

});

test('register existing user', async ({ page }) => {
  const homePage = new HomePage(page);

  //Click LogIn Menu
  await homePage.clickLoginLink();   
  //Click  Register button
  await homePage.clickRegister();  
  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  //Fill the register form 
  await page.getByRole('radio', { name: 'Female' }).check();
  await page.getByRole('textbox', { name: 'First name:' }).click();
  await page.getByRole('textbox', { name: 'First name:' }).fill('Bella');
  await page.getByRole('textbox', { name: 'Last name:' }).click();
  await page.getByRole('textbox', { name: 'Last name:' }).fill('Aye');
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('bella@gmail.com');
  await page.getByRole('textbox', { name: 'Password:', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('test12345');
  await page.getByRole('textbox', { name: 'Confirm password:' }).click();
  await page.getByRole('textbox', { name: 'Confirm password:' }).fill('test12345');
  await page.getByRole('button', { name: 'Register' }).click();

  //Verify that register is successful
  await expect(page.getByText('The specified email already exists')).toBeVisible();
});

test('register new user', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  //Click LogIn Menu
  await homePage.clickLoginLink();   
  //Click  Register button
  await homePage.clickRegister();  
  //Check the title of the Register page
  await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  //Fill the register form 
  await page.getByRole('radio', { name: 'Female' }).check();
  await page.getByRole('textbox', { name: 'First name:' }).fill('Bella');
  await page.getByRole('textbox', { name: 'Last name:' }).fill('Aye');
  const uniqueEmail = `bella.aye_${Date.now()}@yopmail.com`;
  await page.getByRole('textbox', { name: 'Email:' }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('bella12345');
  await page.getByRole('textbox', { name: 'Confirm password:' }).fill('bella12345');
  await page.getByRole('button', { name: 'Register' }).click();

  //Verify that register is successful
  await expect(page.getByText('Your registration completed')).toBeVisible();

  //Click Log out Menu
  await loginPage.clickLogout();
});
