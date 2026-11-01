# Playwright + TypeScript Test Framework

[![Playwright Tests](https://github.com/AmandaXiong/playwright-typescript-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/AmandaXiong/playwright-typescript-framework/actions/workflows/playwright.yml)

Test automation framework built with **Playwright** and **TypeScript**, covering both **UI** and **API** testing:

- **UI tests** for the [SauceDemo](https://www.saucedemo.com) e-commerce site, using the **Page Object Model**
- **API tests** for the [Restful Booker](https://restful-booker.herokuapp.com) hotel booking REST API, using an **API client** class

All tests run automatically in **GitHub Actions** on every push and pull request.

## Tech stack

| Area | Tools |
|---|---|
| Test framework | Playwright Test |
| Language | TypeScript (strict mode) |
| UI testing | Playwright browser automation, Page Object Model |
| API testing | Playwright `request` fixture, API client class |
| Test data | `.env` locally, GitHub Actions encrypted secrets in CI |
| CI/CD | GitHub Actions |
| Reporting | Playwright HTML report (uploaded as a CI artifact) |

## Test coverage

**UI tests (SauceDemo): 11 tests**

| Area | Scenarios |
|---|---|
| **Login** | Standard user logs in successfully · Locked-out user sees an error |
| **Inventory** | Shows all 6 products · Sorts by price (low to high) · Adding a product updates the cart badge |
| **Cart** | Added product appears in the cart · Removing a product empties the cart · Continue Shopping returns to products |
| **Checkout** | Complete purchase end to end · Missing first name shows a validation error · Order total equals item total plus tax |

**API tests (Restful Booker): 10 tests**

| Area | Scenarios |
|---|---|
| **Health** | `GET /ping` returns 201 |
| **Auth** | Wrong password returns no token |
| **Create / Read** | Create a booking · Get a booking by id · Unknown id returns 404 · Search bookings by guest name |
| **Update** | Full update with PUT · Partial update with PATCH (other fields unchanged) |
| **Delete** | Delete with a valid token (then returns 404) · Delete without a token returns 403 |

Covers positive and negative paths, input validation, authentication, and price calculation checks.

## Project structure

```
├── .github/workflows/
│   └── playwright.yml      # CI: runs tests on push/PR, uploads HTML report
├── src/
│   ├── api/                # API client: BookingApi (auth, CRUD, search)
│   ├── data/               # Test data (users from env vars, checkout customer, bookings)
│   ├── pages/              # Page objects: Login, Inventory, Cart, Checkout
│   └── utils/
│       └── env.ts          # Fails fast if a required env var is missing
├── tests/
│   ├── api/                # API specs: booking
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

Fill in `.env` with the test users listed on the [SauceDemo login page](https://www.saucedemo.com) and the demo admin login from the [Restful Booker docs](https://restful-booker.herokuapp.com/apidoc/index.html):

```
STANDARD_USER=
LOCKED_OUT_USER=
PASSWORD=
BOOKER_USER=
BOOKER_PASSWORD=
```

## Running tests

```bash
npm test                                      # run all tests (UI + API)
npx playwright test tests/ui                  # run UI tests only
npx playwright test tests/api                 # run API tests only
npx playwright test -g "complete a purchase"  # run tests matching a name
npm run test:ui                               # interactive UI mode
npm run test:headed                           # watch UI tests in a real browser
npm run report                                # open the last HTML report
```

## Design decisions

**UI**
- **Page Object Model:** locators and actions live in `src/pages/`, so specs read like user stories and a UI change is fixed in one place.
- **`data-test` locators:** `testIdAttribute` is set to `data-test`, so `getByTestId()` targets SauceDemo's stable test attributes instead of fragile CSS or text.
- **Reliable money checks:** price totals are compared with `toBeCloseTo(..., 2)` to avoid floating-point rounding errors.

**API**
- **API client class:** `src/api/BookingApi.ts` wraps each endpoint in a method, the API equivalent of a page object. Specs stay short and readable.
- **Independent tests:** every test creates its own booking, so tests never depend on each other and can run in any order or in parallel.
- **Status codes and body checks:** each test verifies the HTTP status and the response body. `toMatchObject` checks the fields that matter, and the PATCH test proves untouched fields stay the same.
- **Documented quirks:** this demo API returns 201 for delete and 200 for a failed login; the tests assert the real behavior and note it in comments.
- **No flaky timing checks:** the public demo server's speed varies, so response-time assertions are left out on purpose.

**Shared**
- **No credentials in code:** all logins come from environment variables (`.env` locally, encrypted repository secrets in CI). `src/utils/env.ts` throws a clear error if one is missing.
- **CI-friendly config:** 2 retries and traces on retry in CI, `forbidOnly` to block accidental `test.only`, and GitHub annotations for failures.

## Roadmap

- [x] UI tests for the main user flow (login → inventory → cart → checkout)
- [x] API tests (`tests/api/`)
- [ ] Custom fixtures to inject page objects and remove repeated setup
- [ ] Cross-browser runs (Firefox, WebKit)

## Author

**Amanda Xiong** · Senior QA Engineer · [GitHub](https://github.com/AmandaXiong)
