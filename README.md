# Playwright_AT_Bella
Playwright automation assignment for demo website using TypeScript

## Prerequisites
Before running the tests, make sure you have the following installed on your machine:
- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
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
- Go to **File > Open Folder...** and select the project folder (`Playwright-TS-Demo-WebShop`).
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
* **Run a specific test file (e.g., Register test):**
```bash
npx playwright test tests/Register.spec.ts
```
* **View the HTML test report:**
```bash
npx playwright show-report
```

### ⚙️ Test Configuration & Customization

* **Playwright Settings (`playwright.config.ts`):**
  * **Retries (`retries: 1`):** Automatically retries a failed test once to handle potential flaky tests.
  * **Trace (`trace: 'on-first-retry'`):** Captures a trace file during the first retry for easier failure debugging.
  * **Screenshot (`screenshot: 'only-on-failure'`):** Automatically takes a screenshot only when a test fails.
  * **Workers (`workers: 1`):** 
    > **⚠️ IMPORTANT:** Tests must run sequentially with a single worker (`workers: 1`) in both Local and CI/CD environments. Since multiple tests share the same user account (`VALID_USER`), parallel execution will cause state conflicts (e.g., cart/wishlist management overlapping between tests).
