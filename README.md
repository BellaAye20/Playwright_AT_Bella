# Playwright_AT_Bella
Playwright automation assignment for demo website using TypeScript

## Prerequisites
Before running the tests, make sure you have the following installed on your machine:
- **Node.js** (v20 or higher) - [Download Node.js](https://nodejs.org/)
- **Visual Studio Code (VS Code)** - [Download VS Code](https://code.visualstudio.com/)

You can check if Node.js is installed by running this command in your terminal:
```bash
node -v
```

## Getting Started
Follow these steps to set up and run the project locally:

### 1. Clone or Download the Repository
Clone the repository to your local machine.

### 2. Open the Project in VS Code
- Open **VS Code**.
- Go to **File > Open Folder...** and select the project folder (`Playwright_AT_Bella`).
- When you open the project, if you see **"Restricted Mode"** at the top, click on **Manage**.
- In the Workspace Trust window that appears, click the **Trust** button to enable all features and extensions.

### 3. Install Dependencies
Open the integrated terminal in VS Code and run the following command to install required packages:
```bash
npm install
```
### 4. Install Playwright Browsers
Run the following command to install the required browsers:
```bash
npx playwright install
```

### 5. Run Tests
You can execute the test suite using the following commands:

* **Run all test scenarios:**
```bash
npx playwright test
```
* **Run a specific test file (e.g., register test):**
```bash
npx playwright test tests/register.spec.ts
```
* **View the HTML test report:**
```bash
npx playwright show-report
```

### ⚙️ Test Configuration & Customization

* **Playwright Settings (`playwright.config.ts`):**
  * **Retries:** 2 retries on CI/CD and no retries during normal local runs.
  * **Trace (`trace: 'on-first-retry'`):** Recorded on the first retry to help investigate failed tests.
  * **Screenshot (`screenshot: 'only-on-failure'`):** Captured only when a test fails.
  * **Workers (`workers: 1`):** 
    > **⚠️ IMPORTANT:** Tests must run sequentially with a single worker (`workers: 1`) in both Local and CI/CD environments. Since multiple tests share the same user account (`bella.aye@gmail.com`), parallel execution will cause state conflicts (e.g., cart/wishlist management overlapping between tests).

For local debugging, run tests with tracing enabled:
npx playwright test --trace on

### 6. Test Scenarios

The original test scenarios were adapted to the Demo Web Shop application while maintaining the same testing objectives. Some adjustments were necessary because the available product categories, filtering options, and product listings differ between the original application and Demo Web Shop.

### Scenario 1: Register Existing User
* **File:** `tests/register.spec.ts`
* **Test Name:** `register existing user`
* **Description:** Create an existing user in register form.
* **Steps:** 
  * Open the home page and clicks the Register link.
  * Fill the register form using an existing email address.
  * Submit the form.
* **Expected Result:** 
  * Verify the title of the Register page
  * Show the error message: `"The specified email already exists"`.

### Scenario 2: Register New User
* **File:** `tests/register.spec.ts`
* **Test Name:** `register new user`
* **Description:** Create a new user successfully with valid (gender, first name, last name, email, password, and confirm password) fields.
* **Steps:** 
  * Open the home page and clicks the Register link.
  * Fill the register form using valid data and a unique email.
  * Submit the form.
* **Expected Result:** 
  * Verify the title of the Register page
  * Show the success message: `"Your registration completed"`.
  * Verify that new user can log out successfully.

### Scenario 3: Register New User with Invalid Data
* **File:** `tests/register.spec.ts`
* **Test Name:** `register new user - invalid data`
* **Description:** Creates a new user with invalid email and unmatched confirm password fields.
* **Steps:** 
  * Open the home page and clicks the Register link.
  * Fill the register form using invalid email and unmatched confirm password.
  * Submit the form.
* **Expected Result:** 
  * Show the error messages: `"Wrong email"` and `"The password and confirmation password do not match."`.

### Scenario 4: Login with Incorrect Credentials (Email)
* **File:** `tests/login.spec.ts`
* **Test Name:** `login with incorrect credentials - email`
* **Description:** Login user with incorrect email address.
* **Steps:** 
  * Open the login page.
  * Login using invalid email address.
* **Expected Result:** 
  * Show the error message: `"Login was unsuccessful. Please correct the errors and try again."` and `"No customer account found"`.
  * Verify that the user still log out.

### Scenario 5: Login with Incorrect Credentials (Password)
* **File:** `tests/login.spec.ts`
* **Test Name:** `login with incorrect credentials - password`
* **Description:** Login user with correct email, but incorrect password.
* **Steps:** 
  * Open the login page.
  * Login using correct email, but enter incorrect password.
* **Expected Result:** 
  * Show the error message: `"Login was unsuccessful. Please correct the errors and try again."` and `"The credentials provided are incorrect"`.
  * Verify that the user still log out.

### Scenario 6: Login with Correct Credentials
* **File:** `tests/login.spec.ts`
* **Test Name:** `valid login with correct credentials`
* **Description:** Login user with correct email and password.
* **Steps:** 
  * Open the login page.
  * Login using correct email and password.
* **Expected Result:** 
  * Show the success message: `"Welcome to our store"`.
  * Verify that valid email address shows on menu.
  * Verify that new user can log out successfully.

### Scenario 7: Dashboard Test - Adding Shopping Cart
* **File:** `tests/shopping.spec.ts`
* **Test Name:** `dashboard adding shopping cart test`
* **Description:** Filter and add products to the shopping cart.
* **Steps:** 
  * Login user.
  * Clear shopping cart first.
  * Navigate to Desktops Page and choose 4 on Display dropdown.
  * Filter by price - Over 1200.00.
  * Remove filtering.
  * Choose 8 on Display dropdown and add the first, second and third items to Shopping Cart.
* **Expected Result:** 
  * Verify that only 4 items are displayed on Desktops Page and verify the product names of 4 items.
  * Verify that 3 items are displayed after filtered by price.
  * Verify that 4 items displayed after removed filtering.
  * Show the success message: `"The product has been added to"`.
  * Verify that `"Shopping cart (3)"` link displays on menu bar.
  
### Scenario 8: Dashboard Wishlist Test
* **File:** `tests/shopping.spec.ts`
* **Test Name:** `dashboard wishlist test`
* **Description:** Add products to the wishlist.
* **Steps:** 
  * Login user.
  * Clear wishlist first.
  * Navigate to Cell phones page and add 2 items to the wishlist.
* **Expected Result:** 
  * Show the success message: `"The product has been added to"`.
  * Verify that `"Wishlist (2)"` link displays on menu bar.

### Scenario 9: Calculate Shopping Cart Test
* **File:** `tests/shopping.spec.ts`
* **Test Name:** `shopping cart total price test`
* **Description:** Calcuate the subtotal price of all items added to the shopping cart.
* **Steps:** 
  * Login user.
  * Clear shopping cart first.
  * Navigate to Desktops page and add 3 items to the cart.
  * Navigate to Shopping Cart Page and Update Shopping Cart, Continue Shopping and Estimate Shipping buttons are visible.
* **Expected Result:** 
  * Verify that ‘Go To Cart’ button displays when hover mouse over Shopping Cart menu.
  * Verify that ‘Go To Cart’ button navigates to Shopping Cart page.
  * Verify that prices sum for all items is equal to Total Price in the end of the page

### Scenario 10: Empty Shopping Cart Test
* **File:** `tests/shopping.spec.ts`
* **Test Name:** `empty shopping cart`
* **Description:** Clear the shopping cart.
* **Steps:** 
  * Login user.
  * Clear shopping cart first.
  * Navigate to Desktops page and add 3 items to the cart.
  * Navigate to Shopping Cart Page.
  * Delete the first item on shopping cart and repeat until the last item is deleted.
* **Expected Result:** 
  * Verify that the number of products in Shopping Cart table is decreased by 1 whenever item is removed
  * Verify success message: `"Your Shopping Cart is empty!"`

Notes on Scenario Adaptation:

Categories: The original category selections were adjusted to match the categories available in Demo Web Shop.
Filters: Filtering scenarios were adapted to use the filtering capabilities supported by Demo Web Shop.
Item Count: Expected product counts were adjusted to reflect the actual number of products returned by Demo Web Shop after applying the selected category or filter.
Test Objectives: Although some test data and website-specific interactions were changed, the original testing objectives were maintained wherever the target application supported the functionality.