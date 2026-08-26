import test, { expect } from "@playwright/test";
import { clerk } from '@clerk/testing/playwright'
import { LoginPage } from "../../pages/LoginPage";


// For Clerk as testing sign in, to force one test to run at a time, to avoid auth token mismatch.
test.describe.configure({ mode: 'serial' })


test('login to main dashboard page', async ({ page, baseURL }) => {

    // Navigate to an unprotected page that loads Clerk
    const loginPage = new LoginPage(page);
    await loginPage.goToSignInPage();

    await clerk.signIn({
        page,
        emailAddress: process.env.E2E_CLERK_USER_EMAIL as string,
    })

    // Navigate to the main dashboard page (protected page)
    await page.goto(`${baseURL}/dashboard`);
    await expect(page).toHaveTitle("Dashboard | LearnLobe");
})

test('login to main dashboard page with url rewrite: / ', async ({ page, baseURL }) => {

    // Navigate to an unprotected page that loads Clerk
    const loginPage = new LoginPage(page);
    await loginPage.goToSignInPage();

    await clerk.signIn({
        page,
        emailAddress: process.env.E2E_CLERK_USER_EMAIL as string,
    })

    // Navigate to the main dashboard page (protected page)
    await page.goto(`${baseURL}/`);
    await expect(page).toHaveTitle("Dashboard | LearnLobe");
})