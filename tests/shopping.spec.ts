import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';


test.beforeEach(async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  await homePage.gotoDemo();

  //Login with valid credentials
  await homePage.clickLoginLink();
  await loginPage.login();

  //Clear Shopping Cart
  await loginPage.clearShoppingCart();
  await page.waitForTimeout(1000);
});

test('dashboard shopping cart test', async ({ page }) => {
  //Hover over Computers menu and click Desktops
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  //Verify that we have navigate to Desktops Page
  await expect(page.getByRole('heading', { name: 'Desktops' })).toBeVisible();

  //Choose 4 on Display dropdown
  await page.locator('#products-pagesize').selectOption('4');
  //Wait 1 sec
  await page.waitForTimeout(1000);
  //Verify that only 4 items are displayed
  const productItems = page.locator('div.product-grid div.product-item');
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
  await page.getByRole('link', { name: 'Remove Filter' }).click();
  //Verify that 4 items are displayed
  await expect(productItems).toHaveCount(4);

  //Choose 8 on Display dropdown
  await page.locator('#products-pagesize').selectOption('8');

  //Add the first, second and third items on Shopping Cart
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('#add-to-cart-button-72').click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Desktops' }).nth(1).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Add to cart' }).nth(1).click();
  await page.getByRole('radio', { name: 'GB [+100.00]' }).check();
  await page.locator('#add-to-cart-button-16').click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Desktops' }).nth(1).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Add to cart' }).nth(2).click();
  await page.locator('#add-to-cart-button-74').click();
  await page.waitForTimeout(1000);

  //Verify that after every item added a notification with text : The product has been added to your shopping cart
  await expect(page.getByText('The product has been added to')).toBeVisible();

  //Verify that Shopping Cart on Menu bar displays 3
  await expect(page.getByRole('link', { name: 'Shopping cart (3)' })).toBeVisible();
});

test('dashboard wishlist test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //Clear Wishlist first
  await loginPage.clearWishlist();

  //Go to 'Electronics > Cell phones' page to add 2 items to wishlist
  await page.getByRole('link', { name: 'Electronics' }).first().hover();
  await page.getByRole('link', { name: 'Cell phones', exact: true }).click();
  await page.getByRole('link', { name: 'Smartphone', exact: true }).click();
  await page.getByRole('button', { name: 'Add to wishlist' }).click();

  //Verify that after every item added a notification with text : The product has been added to your wishlist – is displayed
  await expect(page.getByText('The product has been added to')).toBeVisible();

  //Add one more item to Wishlist
  await page.getByRole('link', { name: 'Cell phones' }).nth(1).click();
  await page.getByRole('link', { name: 'Phone Cover', exact: true }).click();
  await page.getByRole('button', { name: 'Add to wishlist' }).click();
  await page.waitForTimeout(1000); //Wait 1 sec

  //Verify that after every item added a notification with text : The product has been added to your wishlist – is displayed
  await expect(page.getByText('The product has been added to')).toBeVisible();

  //Verify that Wishlist on Menu bar displays 2
  await expect(page.getByRole('link', { name: 'Wishlist (2)' })).toBeVisible();
});

test('shopping cart test', async ({ page }) => {
  //Before clear the shopping cart, add 3 items to the cart
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('#add-to-cart-button-72').click();
  await page.getByRole('link', { name: 'Desktops' }).nth(1).click();
  await page.getByRole('button', { name: 'Add to cart' }).nth(1).click();
  await page.getByRole('radio', { name: 'GB [+100.00]' }).check();
  await page.locator('#add-to-cart-button-16').click();
  await page.waitForTimeout(1000);
  await page.getByRole('link', { name: 'Desktops' }).nth(1).click();
  await page.getByRole('button', { name: 'Add to cart' }).nth(2).click();
  await page.locator('#add-to-cart-button-74').click();
  await page.waitForTimeout(1000);

  //Hover over Shopping Cart – Menu
  await page.getByRole('link', { name: 'Shopping cart (3)' }).hover();
  await page.waitForTimeout(2000);

  //Verify that ‘Go To Cart’ – button is displayed
  await expect(page.getByRole('button', { name: 'Go to cart' })).toBeVisible();

  //Click ‘Go To Cart’ – button
  await page.getByRole('button', { name: 'Go to cart' }).click();
  
  //Verify that we navigate to Shopping Cart Page
  await expect(page.getByRole('heading', { name: 'Shopping cart' })).toBeVisible();

  //Verify that 3 buttons are displayed
  await expect(page.getByRole('button', { name: 'Update shopping cart' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue shopping' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Estimate shipping' })).toBeVisible();

  //Verify that the prices sum for all items is equal to Total Price in the end of the page
  const cartItems = await page.locator('table.cart tr.cart-item-row').all();
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
  //Before clear the shopping cart, add 3 items to the cart
  await page.getByRole('link', { name: 'Computers' }).first().hover();
  await page.getByRole('link', { name: 'Desktops' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('#add-to-cart-button-72').click();
  await page.getByRole('link', { name: 'Desktops' }).nth(1).click();
  await page.getByRole('button', { name: 'Add to cart' }).nth(1).click();
  await page.getByRole('radio', { name: 'GB [+100.00]' }).check();
  await page.locator('#add-to-cart-button-16').click();
  await page.getByRole('link', { name: 'Desktops' }).nth(1).click();
  await page.getByRole('button', { name: 'Add to cart' }).nth(2).click();
  await page.locator('#add-to-cart-button-74').click();
  //Wait 1 sec
  await page.waitForTimeout(1000);

  //Go to Cart
  await page.locator('#topcartlink').click();
  //Wait 1 sec
  await page.waitForTimeout(1000);

  //Delete the first item on shopping cart and repeat until the last item is deleted
  const cartItems = await page.locator('table.cart tr.cart-item-row').all();
  let count = await cartItems.length;

  for (let i = 0; i < count; i++) {
    let beforeCardQty = await page.locator('#topcartlink').textContent();
    const beforeQtyStr = beforeCardQty?.match(/\d+/);
    const beforeQty = beforeQtyStr ? parseInt(beforeQtyStr[0]) : 0;

    const currentCart_FirstItems = await page.locator('table.cart tr.cart-item-row').first();
    await currentCart_FirstItems.locator('td.remove-from-cart input[type="checkbox"]').first().click();
    await page.getByRole('button', { name: 'Update shopping cart' }).click();

    let afterCardQty = await page.locator('#topcartlink').textContent();
    const afterQtyStr = afterCardQty?.match(/\d+/);
    const afterQty = afterQtyStr ? parseInt(afterQtyStr[0]) : 0;

    //Verify that the number of elements in Shopping Cart table is decreased by 1
    await expect(beforeQty - afterQty).toBe(1);
  }

  //Verify that Shopping Cart is empty
  await expect(page.getByText('Your Shopping Cart is empty!')).toBeVisible();

});

