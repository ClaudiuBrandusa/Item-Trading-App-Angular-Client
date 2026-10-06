import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class IdentityPage extends BasePage {
    constructor(protected page: Page) {
        super(page);
    }

    // navigation
    async navigateToPage() {
        await this.page.goto('/');
    }

    // controls
    async goToRegister() {
        await this.page.click('text=Register');
    }

    async goToLogin() {
        await this.page.click('text=Login');
    }
    
    // form controls
    async getUsernameFormControlLocator(): Promise<Locator> {
        return await this.getFormControlLocatorByName('username');
    }

    async getPasswordFormControlLocator(): Promise<Locator> {
        return await this.getFormControlLocatorByName('password');
    }

    async getEmailFormControlLocator(): Promise<Locator> {
        return await this.getFormControlLocatorByName('email');
    }

    async getConfirmPasswordFormControlLocator(): Promise<Locator> {
        return await this.getFormControlLocatorByName('confirm_password');
    }
}
