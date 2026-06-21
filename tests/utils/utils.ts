import { Page } from '@playwright/test';
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
