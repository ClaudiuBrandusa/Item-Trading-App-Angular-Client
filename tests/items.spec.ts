import { test, expect } from '@playwright/test';
import { connectWithDefaultAccount, goToItems } from './utils';

test('items', async({ page }) => {
  await connectWithDefaultAccount(page);

  await goToItems(page);

  let itemsListComponent = await page.locator('app-list-items');

  await expect(itemsListComponent).toHaveCount(1);

  await expect(itemsListComponent).toBeVisible();
  
  await expect(itemsListComponent).toBeAttached();
});

