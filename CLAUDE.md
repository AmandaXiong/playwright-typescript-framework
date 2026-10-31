# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Playwright + TypeScript test automation framework (`@playwright/test` ^1.57) targeting **https://www.saucedemo.com**. The project is at an early scaffolding stage: the directory layout exists but most folders are still empty.

## Commands

There are no npm scripts in `package.json`; use `npx playwright` directly.

```bash
npm ci                                    # install dependencies
npx playwright install --with-deps        # install browsers
npx playwright test                       # run all tests on chromium, firefox, webkit
npx playwright test tests/ui/login.spec.ts          # run one file
npx playwright test -g "test title"                 # run tests matching a title
npx playwright test --project=chromium              # run on one browser
npx playwright test --headed / --ui / --debug       # interactive modes
npx playwright show-report                # open the HTML report
npx tsc --noEmit                          # type-check (no lint is configured)
```

## Configuration ([playwright.config.ts](playwright.config.ts))

- `testDir: './tests'` — both `tests/ui/` and `tests/api/` are picked up.
- `baseURL` is saucedemo, so tests should use relative paths like `page.goto('/')`.
- `testIdAttribute: 'data-test'` — saucedemo marks elements with `data-test`, so `page.getByTestId('username')` targets `[data-test="username"]`. Prefer `getByTestId` for saucedemo elements.
- CI (`process.env.CI`): `forbidOnly`, 2 retries, 1 worker. Locally: no retries, auto workers.
- Traces are recorded on first retry; screenshots only on failure. Reporter is HTML (`playwright-report/`).

## Intended structure

- `tests/ui/` — browser UI specs; `tests/api/` — API specs (via Playwright's `request` fixture).
- `src/pages/` — page objects.
- `src/fixture/` (singular) — custom fixtures extending Playwright's `test` (e.g. injecting page objects).
- `src/data/` — test data (e.g. saucedemo users).
- `src/utils/` — shared helpers.

[tsconfig.json](tsconfig.json) is `strict`, CommonJS, ES2022 (matches `"type": "commonjs"` in package.json). No path aliases are configured, so imports from `src/` into `tests/` are relative.

## CI

[.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs `npx playwright test` on push/PR to `main`, then uploads `playwright-report/` as an artifact.
