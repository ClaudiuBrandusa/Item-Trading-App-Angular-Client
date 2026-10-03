import { Page } from "@playwright/test";
import { USERS } from "../constants";
import { AccountConfig } from "../models/account.config";

export class AuthHelper {
    constructor(private readonly page: Page) {}

    // authentication
    async connectWithDefaultAccount() {
        await this.connectWithAccount(USERS.user);
    }

    async connectWithAccount(user: AccountConfig) {
        await this.page.goto('/');

        const usernameControl = this.page.locator('[formcontrolname="username"]');
        const passwordControl = this.page.locator('[formcontrolname="password"]');

        await usernameControl.fill(user.Username);
        await passwordControl.fill(user.Password);

        await this.page.getByRole('button', { name: ' Login ' }).click();
    }

    async logout() {
        await this.page.getByText('Logout').click();
    }
}

