import { Locator, Page } from '@playwright/test';

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
