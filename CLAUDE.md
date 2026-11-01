# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Playwright + TypeScript (`@playwright/test` ^1.57) end-to-end test framework for **https://www.saucedemo.com**, using the Page Object Model. It covers the main user flow: login → inventory → cart → checkout (11 UI tests). See [README.md](README.md) for the project summary.

## Commands

```bash
npm ci                                    # install dependencies
npx playwright install --with-deps chromium   # install the browser
npm test                                  # run all tests (npx playwright test)
npx playwright test tests/ui/login.spec.ts    # run one file
npx playwright test -g "test title"           # run tests matching a title
npm run test:ui                           # interactive UI mode
npm run test:headed                       # watch tests run in a real browser
npm run report                            # open the last HTML report
npm run typecheck                         # type-check (tsc --noEmit); no lint is configured
```

## Configuration ([playwright.config.ts](playwright.config.ts))

- `testDir: './tests'`; only `tests/ui/` has specs so far.
- `baseURL` is saucedemo, so tests use relative paths like `page.goto('/')`.
- `testIdAttribute: 'data-test'`: `page.getByTestId('username')` targets `[data-test="username"]`. Always prefer `getByTestId` for saucedemo elements.
- Runs on **Chromium only** (Firefox and WebKit projects are commented out).
- CI (`process.env.CI`): `forbidOnly`, 2 retries, 1 worker, `github` + `html` reporters. Locally: no retries, auto workers, `html` reporter.
- Traces are recorded on first retry; screenshots only on failure.
- `dotenv` loads `.env` at the top of the config.

## Structure

- `src/pages/`: page objects (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`). Locators are `readonly` fields set in the constructor; actions are `async` methods.
- `src/data/`: test data. `users.ts` reads credentials from env vars; `customer.ts` holds fake checkout details (not secret).
- `src/utils/env.ts`: `required(name)` throws a clear error when an env var is missing.
- `tests/ui/`: one spec per area (`login`, `inventory`, `cart`, `checkout`). Each spec logs in through `LoginPage` in `beforeEach` (or the test itself).

[tsconfig.json](tsconfig.json) is `strict`, CommonJS, ES2022. No path aliases, so imports from `src/` into `tests/ui/` use `../../src/...`.

## Test data and secrets

- Credentials (`STANDARD_USER`, `LOCKED_OUT_USER`, `PASSWORD`) come from `.env` locally (git-ignored; template in `.env.example`) and from GitHub Actions repository secrets in CI. Never hard-code them.

## CI

[.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs on push/PR to `main`: installs dependencies and Chromium, runs `npx playwright test` with the three secrets as env vars, and uploads `playwright-report/` as an artifact.

## Conventions

- Work on a branch (`feature/...`, `chore/...`, `docs/...`) and merge to `main` through a pull request.
- Run the full suite (`npm test`) before committing.
- Do not add "Co-Authored-By" or "Claude-Session" lines to commit messages or PR descriptions.

## Planned

- Custom fixtures in `src/fixture/` to inject page objects and remove repeated setup.
- API tests in `tests/api/` using Playwright's `request` fixture.
- Cross-browser runs (Firefox, WebKit).
