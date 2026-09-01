import test, { expect } from "@playwright/test";
import { DashboardPage } from "../../pages/DashboardPage";

test.use({ storageState: 'playwright/.clerk/user.json' })

test('check main dashboard page with url rewrite: / ', async ({ page, baseURL }) => {

    const dashboardPage = new DashboardPage(page, baseURL);

    // Navigate to the main dashboard page (protected page)
    await dashboardPage.goToDashboardPageUrlRewrite();
    await expect(page).toHaveTitle("Dashboard | LearnLobe");
});

test('dashboard renders all cards', async ({ page, baseURL }) => {
    const dashboardPage = new DashboardPage(page, baseURL);
    await dashboardPage.goToDashboardPage();

    await expect(page).toHaveTitle("Dashboard | LearnLobe");
    await expect(page.getByText("Completed Today")).toBeVisible();
    await expect(page.getByText("Completed This Month")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("Latest Resources")).toBeVisible();
    await expect(page.getByText("Top 4 Categories")).toBeVisible();
    await expect(page.getByText("Chapters With Review Dates Due")).toBeVisible();
    await expect(page.getByText("Top Pinned Resources")).toBeVisible();
});
