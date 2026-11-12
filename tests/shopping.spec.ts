import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import RegisterPage from '../pages/register-page';
import { ShoppingPage } from '../pages/shopping-page';
import { createUniqueUser } from '../test-data/users';

test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  const registerPage = new RegisterPage(page);

  await homePage.gotoDemo();

  //Navigate to Register page
  await homePage.clickRegisterLink();

  //Create a unique user
  const user = createUniqueUser();
  await registerPage.register(user.gender, user.firstName, user.lastName, user.email, user.password, user.password);

  //Wait until registration process is completed
  await expect(registerPage.successMessage).toHaveText('Your registration completed');
});

test('dashboard adding shopping cart test', async ({ page }) => {
  const shoppingPage = new ShoppingPage(page);

  //Hover over Computers menu and click Desktops
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  //Verify that we have navigate to Desktops Page
  await expect(page.getByRole('heading', { name: 'Desktops' })).toBeVisible();

  //Choose 4 on Display dropdown
  await shoppingPage.getPageSize.selectOption('4');

  //Verify that only 4 items are displayed
  const productItems = await shoppingPage.productItems;
  await expect(productItems).toHaveCount(4);

  //Get product names
  let productNames = '';
  let count2 = await productItems.count();
  if (count2 > 0) {
    for (const product of await productItems.all()) {
      productNames += await product.locator('h2.product-title').textContent() || '';
    }
  }

  //Verify product names
  expect(productNames).toContain('Build your own cheap computer');
  expect(productNames).toContain('Build your own computer');
  expect(productNames).toContain('Build your own expensive computer');
  expect(productNames).toContain('Desktop PC with CDRW');  

  //Filter by price - Over 1200.00
  await page.getByRole('link', { name: 'Over' }).click();

  //Verify that 3 items are displayed
  await expect(productItems).toHaveCount(3);

  //Remove filter
  await shoppingPage.getRemoveFilter.click();

  //Verify that 4 items are displayed
  await expect(productItems).toHaveCount(4);

  //Choose 8 on Display dropdown
  await shoppingPage.getPageSize.selectOption('8');

  //Add the first, second and third items on Shopping Cart
  await shoppingPage.addDesktopProductToCart(); 

  //Verify that Shopping Cart on Menu bar displays 3
  await expect(page.getByRole('link', { name: 'Shopping cart (3)' })).toBeVisible();
});

test('dashboard wishlist test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shoppingPage = new ShoppingPage(page);

  //Clear Wishlist first
  await loginPage.clearWishlist();

  //Go to 'Electronics > Cell phones' page to add 2 items to wishlist
  await page.getByRole('link', { name: 'Electronics' }).first().hover();
  await page.getByRole('link', { name: 'Cell phones', exact: true }).click();
  await page.getByRole('link', { name: 'Smartphone', exact: true }).click();
  await shoppingPage.clickAddToWishlist();

  //Verify that after every item added a notification with text : The product has been added to your wishlist – is displayed
  await expect(page.locator('#bar-notification')).toContainText('The product has been added to your wishlist');

  //Add one more item to Wishlist
  await page.getByRole('link', { name: 'Cell phones' }).nth(1).click();
  await page.getByRole('link', { name: 'Phone Cover', exact: true }).click();
  await shoppingPage.clickAddToWishlist();

  //Verify that after every item added a notification with text : The product has been added to your wishlist – is displayed
  await expect(page.locator('#bar-notification')).toContainText('The product has been added to your wishlist');

  //Verify that Wishlist on Menu bar displays 2
  await expect(page.getByRole('link', { name: 'Wishlist (2)' })).toBeVisible();
});

test('shopping cart total price test', async ({ page }) => {
  const shoppingPage = new ShoppingPage(page);

  //After clear the shopping cart, add 3 items to the cart
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  await shoppingPage.addDesktopProductToCart();   

  //Hover over Shopping Cart – Menu
  await page.locator('#topcartlink').click();
  
  //Wait until Shopping Cart page is displayed
  await expect(page.getByRole('heading', { name: 'Shopping cart' })).toBeVisible();

  //Verify that 3 buttons are displayed
  await expect(shoppingPage.getUpdateShoppingCart).toBeVisible();
  await expect(shoppingPage.getContinueShopping).toBeVisible();
  await expect(shoppingPage.getEstimateShipping).toBeVisible();

  //Verify that the prices sum for all items is equal to Total Price in the end of the page
  // Get all product subtotal texts from the shopping cart
  const itemPrices = await shoppingPage.cartItems
    .locator('span.product-subtotal')
    .allTextContents();

  //Price conversion function to preserve decimal values and handle separators
  const toCents = (price: string): number => {
    const normalizedPrice = price
      .replace(/,/g, '')
      .replace(/[^\d.-]/g, '');

    const amount = Number(normalizedPrice);

    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid price: ${price}`);
    }

    return Math.round(amount * 100);
  };

  //Calculate the sum of all item prices in cents
  const calculatedTotal = itemPrices.reduce(
    (sum, price) => sum + toCents(price),
    0
  );

  //Get the total price displayed on the shopping cart page
  const totalPriceText = await page
    .getByRole('row')
    .filter({ hasText: /Total:/ })
    .locator('strong')
    .textContent();

  //Convert the displayed total to cents
  expect(totalPriceText).not.toBeNull();

  const displayedTotal = toCents(totalPriceText!);

  //Compare the calculated total with the displayed total
  expect(calculatedTotal).toBe(displayedTotal);
});

test('empty shopping cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const shoppingPage = new ShoppingPage(page);

  //Before clear the shopping cart, add 3 items to the cart
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  await shoppingPage.addDesktopProductToCart(); 

  //Go to Cart
  await homePage.clickShoppingCartLink();

  //Wait until Shopping Cart page is displayed
  await expect(page.getByRole('heading', { name: 'Shopping cart' })).toBeVisible();

  //Verify that 3 items exist in the shopping cart table
  await expect(shoppingPage.cartItems).toHaveCount(3);

  //Delete the first item on shopping cart and repeat until the last item is deleted
  const initialRowCount = await shoppingPage.cartItems.count();

  for (let i = 0; i < initialRowCount; i++) {
    // Get the number of rows before removal
    const beforeRowCount = await shoppingPage.cartItems.count();

    // Remove the first item
    const currentCart_FirstItems = shoppingPage.cartItems.first();
    await currentCart_FirstItems.locator('td.remove-from-cart input[type="checkbox"]').first().click();

    await shoppingPage.clickUpdateShoppingCart();

    // Verify that the table row count decreases by 1
    await expect(shoppingPage.cartItems).toHaveCount(beforeRowCount - 1);
  }

  //Verify that Shopping Cart is empty
  await expect(shoppingPage.shoppingMessage).toHaveText('Your Shopping Cart is empty!');
});

