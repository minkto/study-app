import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { expect, test as setup } from "@playwright/test";
import path from "path";

// Ensures that Clerk setup is done before any tests run
setup.describe.configure({
    mode: "serial",
});

setup("global setup", async () => {
    await clerkSetup(
        { dotenv: false }
    );

    if (!process.env.E2E_CLERK_USER_EMAIL) {
        throw new Error(
            "Please provide E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD environment variables."
        );
    }
});


// Define the path to the storage file, which is `user.json`
const authFile = path.join(__dirname, '../../playwright/.clerk/user.json')

setup('authenticate and save state to storage', async ({ page, baseURL }) => {
    await page.goto('/');

    // Sign in using the emailAddress parameter, which creates a
    // server-side token and bypasses all verification steps
    await clerk.signIn({
        page,
        emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
    })
    await page.goto(`${baseURL}/dashboard`);

    // Ensure the user has successfully accessed the protected page
    await expect(page).toHaveTitle("Dashboard | LearnLobe");

    // Store the auth state.
    await page.context().storageState({ path: authFile });
})