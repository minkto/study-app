import { Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToSignInPage() {
        await this.page.goto(`/sign-in`);
    }

    async goToDashboardPage() {
        await this.page.goto('/dashboard');
    }
}