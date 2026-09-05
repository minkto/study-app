import { test as teardown } from '@playwright/test';

teardown.use({ storageState: 'playwright/.clerk/user.json' });

teardown('remove user data', async ({ request, baseURL }) => {
    if (!process.env.E2E_CLEAR_USER_DATA || process.env.E2E_CLEAR_USER_DATA?.toLowerCase() !== 'true') {
        console.log("E2E_CLEAR_USER_DATA environment variable is not enabled. Skipping user data deletion.");
        return;
    }

    const response = await request.delete(`${baseURL}/api/users/data`);

    if (!response.ok()) {
        throw new Error(`Failed to delete user data: ${response.status()} - ${await response.text()}`);
    }

    console.log(`Delete user data response status: ${response.status()}`);
});
