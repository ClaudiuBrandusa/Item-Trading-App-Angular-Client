import { Locator, Page } from '@playwright/test';
import { USERS } from 'tests/constants';

export async function connectWithDefaultAccount(page: Page) {
    await page.goto('/');

    const usernameControl = page.locator('[formcontrolname="username"]');
    const passwordControl = page.locator('[formcontrolname="password"]');

    await usernameControl.fill(USERS.user.username);
    await passwordControl.fill(USERS.user.password);

    await page.getByRole('button', { name: ' Login ' }).click();
}

export async function goToItems(page: Page) {
    await page.getByText('Items').click();
}

export async function goToInventory(page: Page) {
    await page.getByText('Inventory').click();
}

export function getButtonWithName(source: Locator, name: string): Locator {
  return source.getByRole('button', { name });
}
