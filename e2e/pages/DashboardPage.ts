import { Page } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;
    readonly baseUrl: string | undefined;


    constructor(page: Page, baseUrl: string | undefined) {
        this.page = page;
        this.baseUrl = baseUrl;
    }

    async goToDashboardPage() {
        await this.page.goto(`${this.baseUrl}/dashboard`);
    }

    async goToDashboardPageUrlRewrite() {
        await this.page.goto(`${this.baseUrl}/`);
    }
}