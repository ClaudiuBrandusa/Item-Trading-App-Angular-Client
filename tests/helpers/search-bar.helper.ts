import { Page } from "@playwright/test";

export class SearchBarHelper {
    constructor(private page: Page) {}

    async getSearchBarInputLocator() {
        return await this.page.getByTestId('search-bar-input');
    }

    async getSearchBarSubmitButtonLocator() {
        return await this.page.getByTestId('search-bar-submit-button');
    }
}