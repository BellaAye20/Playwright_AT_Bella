import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import { ShoppingPage } from '../pages/shopping-page';


test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const shoppingPage = new ShoppingPage(page);

  await homePage.gotoDemo();
  await page.waitForTimeout(1000);

  //Login with valid credentials
  await homePage.clickLoginLink();
  await loginPage.login('bella.aye@gmail.com','gs123456');
  await page.waitForTimeout(1000);
  //Clear Shopping Cart
  await shoppingPage.clearShoppingCart();
  await page.waitForTimeout(2000);
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
  await page.waitForTimeout(2000);

  await Promise.all([
    //Filter by price - Over 1200.00
    await page.getByRole('link', { name: 'Over' }).click(),

    //Verify that 3 items are displayed
    await expect(productItems).toHaveCount(3),

    //Remove filter
    await shoppingPage.getRemoveFilter.click(),

    //Verify that 4 items are displayed
    await expect(productItems).toHaveCount(4),

    //Choose 8 on Display dropdown
    await shoppingPage.getPageSize.selectOption('8'),

    //Add the first, second and third items on Shopping Cart
    await page.getByRole('button', { name: 'Add to cart' }).first().click(),

    await page.locator('#add-to-cart-button-72').click(),

    //Verify that after every item added a notification with text : The product has been added to your shopping cart
    await expect(page.getByText('The product has been added to')).toBeVisible(),

    await page.getByRole('link', { name: 'Desktops' }).nth(1).click(),

    await page.getByRole('button', { name: 'Add to cart' }).nth(1).click(),

    //Verify that after every item added a notification with text : The product has been added to your shopping cart
    await expect(page.getByText('The product has been added to')).toBeVisible(),

    await page.getByRole('radio', { name: 'GB [+100.00]' }).check(),
    await page.locator('#add-to-cart-button-16').click(),

    await page.getByRole('link', { name: 'Desktops' }).nth(1).click(),

    await page.getByRole('button', { name: 'Add to cart' }).nth(2).click(),
    await page.locator('#add-to-cart-button-74').click()
  ]);

  //Verify that after every item added a notification with text : The product has been added to your shopping cart
  await expect(page.getByText('The product has been added to')).toBeVisible();

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
  await expect(page.getByText('The product has been added to')).toBeVisible();

  //Add one more item to Wishlist
  await page.getByRole('link', { name: 'Cell phones' }).nth(1).click();
  await page.getByRole('link', { name: 'Phone Cover', exact: true }).click();
  await shoppingPage.clickAddToWishlist();
  await page.waitForTimeout(1000); //Wait 1 sec

  //Verify that after every item added a notification with text : The product has been added to your wishlist – is displayed
  await expect(page.getByText('The product has been added to')).toBeVisible();

  //Verify that Wishlist on Menu bar displays 2
  await expect(page.getByRole('link', { name: 'Wishlist (2)' })).toBeVisible();
});

test('shopping cart total price test', async ({ page }) => {
  const shoppingPage = new ShoppingPage(page);

  //After clear the shopping cart, add 3 items to the cart
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  await page.waitForTimeout(1000);

  await Promise.all([
    await page.getByRole('button', { name: 'Add to cart' }).first().click(),
    await page.locator('#add-to-cart-button-72').click(),

    await page.getByRole('link', { name: 'Desktops' }).nth(1).click(),
    await page.getByRole('button', { name: 'Add to cart' }).nth(1).click(),

    await page.getByRole('radio', { name: 'GB [+100.00]' }).check(),
    await page.locator('#add-to-cart-button-16').click(),

    await page.getByRole('link', { name: 'Desktops' }).nth(1).click(),
    await page.getByRole('button', { name: 'Add to cart' }).nth(2).click(),
    await page.locator('#add-to-cart-button-74').click(),
    await page.waitForTimeout(3000)    
  ]);

  //Hover over Shopping Cart – Menu
  await page.locator('#topcartlink').hover();
  await page.waitForTimeout(2000);

  //Verify that ‘Go To Cart’ – button is displayed
  await expect(page.locator('input.cart-button')).toBeVisible()

  //Click ‘Go To Cart’ – button
  await page.locator('input.cart-button').click();
  //await shoppingPage.clickGotoCart();
  await page.waitForTimeout(1000);

  //Verify that we navigate to Shopping Cart Page
  await expect(page.getByRole('heading', { name: 'Shopping cart' })).toBeVisible();

  //Verify that 3 buttons are displayed
  await expect(shoppingPage.getUpdateShoppingCart).toBeVisible();
  await expect(shoppingPage.getContinueShopping).toBeVisible();
  await expect(shoppingPage.getEstimateShipping).toBeVisible();

  //Verify that the prices sum for all items is equal to Total Price in the end of the page
  const cartItems = await shoppingPage.cartItems.all();
  let cartItem = cartItems[0];
  let total = await cartItem.locator('span.product-subtotal').textContent();
  let totalStr = total?.match(/\d+/);
  let subtotal = totalStr ? parseInt(totalStr[0]) : 0;
  
  cartItem = cartItems[1];
  total = await cartItem.locator('span.product-subtotal').textContent();
  totalStr = total?.match(/\d+/);
  subtotal += totalStr ? parseInt(totalStr[0]) : 0;

  cartItem = cartItems[2];
  total = await cartItem.locator('span.product-subtotal').textContent();
  totalStr = total?.match(/\d+/);
  subtotal += totalStr ? parseInt(totalStr[0]) : 0;

  await expect(subtotal).toBe(3995.00);
  await expect(page.getByRole('row', { name: 'Total: 3995.00', exact: true }).getByRole('strong')).toBeVisible();
});

test('empty shopping cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const shoppingPage = new ShoppingPage(page);

  await Promise.all([
    //Before clear the shopping cart, add 3 items to the cart
    await page.getByRole('link', { name: 'Computers' }).first().hover(),
    await page.getByRole('link', { name: 'Desktops' }).click(),
    await page.getByRole('button', { name: 'Add to cart' }).first().click(),
    await page.locator('#add-to-cart-button-72').click(),
    
    await page.getByRole('link', { name: 'Desktops' }).nth(1).click(),
    await page.getByRole('button', { name: 'Add to cart' }).nth(1).click(),
    await page.getByRole('radio', { name: 'GB [+100.00]' }).check(),
    await page.locator('#add-to-cart-button-16').click(),
   
    await page.getByRole('link', { name: 'Desktops' }).nth(1).click(),
    await page.getByRole('button', { name: 'Add to cart' }).nth(2).click(),
    await page.locator('#add-to-cart-button-74').click(),

    //Go to Cart
    await homePage.clickShoppingCartLink()
  ]);

  //Delete the first item on shopping cart and repeat until the last item is deleted
  const cartItems = await shoppingPage.cartItems.all();
  let count = cartItems.length;

  for (let i = 0; i < count; i++) {
    let beforeCardQty = await homePage.getShoppingCartLink.textContent();
    const beforeQtyStr = beforeCardQty?.match(/\d+/);
    const beforeQty = beforeQtyStr ? parseInt(beforeQtyStr[0]) : 0;

    const currentCart_FirstItems = await shoppingPage.cartItems.first();
    await currentCart_FirstItems.locator('td.remove-from-cart input[type="checkbox"]').first().click();
    await shoppingPage.clickUpdateShoppingCart();

    let afterCardQty = await homePage.getShoppingCartLink.textContent();
    const afterQtyStr = afterCardQty?.match(/\d+/);
    const afterQty = afterQtyStr ? parseInt(afterQtyStr[0]) : 0;

    //Verify that the number of elements in Shopping Cart table is decreased by 1
    await expect(beforeQty - afterQty).toBe(1);
  }

  //Verify that Shopping Cart is empty
  await expect(shoppingPage.shoppingMessage).toHaveText('Your Shopping Cart is empty!');
});

