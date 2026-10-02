import { Locator, Page } from "@playwright/test";

export class BasePage {
    constructor(protected page: Page) {}

    async getMenuButtonsListLocator(): Promise<Locator> {
        return await this.page.locator('app-menu-button');
    }
}