# Playwright + TypeScript Test Framework

[![Playwright Tests](https://github.com/AmandaXiong/playwright-typescript-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/AmandaXiong/playwright-typescript-framework/actions/workflows/playwright.yml)

End-to-end UI test automation framework for the [SauceDemo](https://www.saucedemo.com) e-commerce site, built with **Playwright** and **TypeScript** using the **Page Object Model**. Tests run automatically in **GitHub Actions** on every push and pull request.

## Tech stack

| Area | Tools |
|---|---|
| Test framework | Playwright Test |
| Language | TypeScript (strict mode) |
| Design pattern | Page Object Model |
| Test data | `.env` locally, GitHub Actions encrypted secrets in CI |
| CI/CD | GitHub Actions |
| Reporting | Playwright HTML report (uploaded as a CI artifact) |

## Test coverage

| Area | Scenarios |
|---|---|
| **Login** | Standard user logs in successfully · Locked-out user sees an error |
| **Inventory** | Shows all 6 products · Sorts by price (low to high) · Adding a product updates the cart badge |
| **Cart** | Added product appears in the cart · Removing a product empties the cart · Continue Shopping returns to products |
| **Checkout** | Complete purchase end to end · Missing first name shows a validation error · Order total equals item total plus tax |

Covers both positive and negative paths, including input validation and price calculation checks.

## Project structure

```
├── .github/workflows/
│   └── playwright.yml      # CI: runs tests on push/PR, uploads HTML report
├── src/
│   ├── data/               # Test data (users from env vars, checkout customer)
│   ├── pages/              # Page objects: Login, Inventory, Cart, Checkout
│   └── utils/
│       └── env.ts          # Fails fast if a required env var is missing
├── tests/
│   └── ui/                 # UI specs: login, inventory, cart, checkout
├── .env.example            # Template for local environment variables
└── playwright.config.ts    # Base URL, data-test locators, retries, reporters
```

## Getting started

**Prerequisites:** Node.js 18+ and Git.

```bash
# 1. Clone the repo
git clone https://github.com/AmandaXiong/playwright-typescript-framework.git
cd playwright-typescript-framework

# 2. Install dependencies and browsers
npm ci
npx playwright install --with-deps chromium

# 3. Create your local .env from the template
cp .env.example .env
```

Fill in `.env` with the test users listed on the [SauceDemo login page](https://www.saucedemo.com):

```
STANDARD_USER=
LOCKED_OUT_USER=
PASSWORD=
```

## Running tests

```bash
npm test                                      # run all tests
npx playwright test tests/ui/cart.spec.ts     # run one file
npx playwright test -g "complete a purchase"  # run tests matching a name
npm run test:ui                               # interactive UI mode
npm run test:headed                           # watch tests in a real browser
npm run report                                # open the last HTML report
```

## Design decisions

- **Page Object Model:** locators and actions live in `src/pages/`, so specs read like user stories and a UI change is fixed in one place.
- **`data-test` locators:** `testIdAttribute` is set to `data-test`, so `getByTestId()` targets SauceDemo's stable test attributes instead of fragile CSS or text.
- **No credentials in code:** usernames and passwords come from environment variables (`.env` locally, encrypted repository secrets in CI). `src/utils/env.ts` throws a clear error if one is missing.
- **Reliable money checks:** price totals are compared with `toBeCloseTo(..., 2)` to avoid floating-point rounding errors.
- **CI-friendly config:** 2 retries and traces on retry in CI, `forbidOnly` to block accidental `test.only`, and GitHub annotations for failures.

## Roadmap

- [ ] Custom fixtures to inject page objects and remove repeated setup
- [ ] API tests (`tests/api/`)
- [ ] Cross-browser runs (Firefox, WebKit)

## Author

**Amanda Xiong** · Senior QA Engineer · [GitHub](https://github.com/AmandaXiong)
