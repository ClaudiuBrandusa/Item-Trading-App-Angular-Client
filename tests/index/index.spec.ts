import { test, expect, Page } from '@playwright/test';
import { connectWithDefaultAccount } from 'tests/utils/utils';

test.describe('Access module pages', () => {
  test.beforeEach(async ({ page }) => {
    await connectWithDefaultAccount(page);
  });

  test('reach index page by logging in', async({ page }) => {
    await expect(page.locator('app-navbar')).toBeVisible();
    await expect(page.locator('li', { hasText: 'Index' })).toHaveClass('selected');
    let notificationsButton = await page.locator('[data-testid="notifications-button"]');
    await expect(notificationsButton).toBeVisible();
    await notificationsButton.click();

    await page.waitForTimeout(100);

    let notificationsComponent = await page.locator('app-notifications');

    await expect(notificationsComponent).toHaveCount(1);

    await expect(notificationsComponent).toBeAttached();

    let notificationElements = await notificationsComponent.locator('app-notification');
  });

  test('should be able to access items', async({ page }) => {
    await expectNavbarElementToNotBeSelected(page, 'Items');
    await expectNavbarElementToBeSelected(page, 'Index');

    await page.getByText('Items').click();

    await expectNavbarElementToNotBeSelected(page, 'Index');
    await expectNavbarElementToBeSelected(page, 'Items');
    
    await expect(page).toHaveURL('items');
  });

  test('should be able to access inventory', async({ page }) => {
    await expectNavbarElementToNotBeSelected(page, 'Inventory');
    await expectNavbarElementToBeSelected(page, 'Index');

    await page.getByText('Inventory').click();

    await expectNavbarElementToNotBeSelected(page, 'Index');
    await expectNavbarElementToBeSelected(page, 'Inventory');

    await expect(page).toHaveURL('inventory');
  });

  test('should be able to access trades', async({ page }) => {
    await expectNavbarElementToNotBeSelected(page, 'Trades');
    await expectNavbarElementToBeSelected(page, 'Index');

    await page.getByText('Trades').click();

    await expectNavbarElementToNotBeSelected(page, 'Index');
    await expectNavbarElementToBeSelected(page, 'Trades');

    await expect(page).toHaveURL('trades');
  });

  // Disabled for now (until the Wallet component is implemented)
  // test('should be able to access wallet', async({ page }) => {
  //   await expectNavbarElementToNotBeSelected(page, 'Wallet');
  //   await expectNavbarElementToBeSelected(page, 'Index');

  //   await page.getByText('Wallet').click();

  //   await expectNavbarElementToNotBeSelected(page, 'Index');
  //   await expectNavbarElementToBeSelected(page, 'Wallet');

  //   await expect(page).toHaveURL('wallet');
  // });

  test('log out', async({ page }) => {
    await page.getByText('Logout').click();

    await expect(page.getByRole('button', { name: ' Login ' })).toBeVisible();
  });
});

// Utils

async function expectNavbarElementToBeSelected(page: Page, elementName: string) {
  await expect(page.locator('li', { hasText: elementName })).toHaveClass('selected');
};

async function expectNavbarElementToNotBeSelected(page: Page, elementName: string) {
  await expect(page.locator('li', { hasText: elementName })).not.toHaveClass('selected');
};
