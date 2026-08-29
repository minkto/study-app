import test, { expect } from "@playwright/test";
import { DashboardPage } from "../../pages/DashboardPage";

test.use({ storageState: 'playwright/.clerk/user.json' })

test('check main dashboard page with url rewrite: / ', async ({ page, baseURL }) => {

    const dashboardPage = new DashboardPage(page, baseURL);

    // Navigate to the main dashboard page (protected page)
    await dashboardPage.goToDashboardPageUrlRewrite();
    await expect(page).toHaveTitle("Dashboard | LearnLobe");
})