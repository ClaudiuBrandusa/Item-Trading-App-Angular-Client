import { Locator, Page } from '@playwright/test';
import { USERS } from 'tests/constants';
import { AccountConfig } from './models/account.config';

export async function connectWithDefaultAccount(page: Page) {
    await connectWithAccount(page, USERS.user);
}

export async function connectWithAccount(page: Page, user: AccountConfig) {
    await page.goto('/');

    const usernameControl = page.locator('[formcontrolname="username"]');
    const passwordControl = page.locator('[formcontrolname="password"]');

    await usernameControl.fill(user.Username);
    await passwordControl.fill(user.Password);

    await page.getByRole('button', { name: ' Login ' }).click();
}

export async function logout(page: Page) {
    await page.getByText('Logout').click();
}

export async function goToItems(page: Page) {
    await page.getByText('Items').click();
}

export async function goToInventory(page: Page) {
    await page.getByText('Inventory').click();
}

export async function goToTrades(page: Page) {
    await page.getByText('Trades').click();
}

export function getButtonWithName(source: Locator, name: string): Locator {
    return source.getByRole('button', { name });
}
