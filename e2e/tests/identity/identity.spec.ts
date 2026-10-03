import { test, expect } from '@playwright/test';
import { USERS } from 'e2e/utils/constants';
import { AuthHelper } from 'e2e/utils/helpers/auth.helper';
import { IdentityPage } from 'e2e/utils/pages/identity.page';


test.describe('Identity tests', () => {
  let identityPage: IdentityPage;

  test.beforeEach(async ({ page }) => {
    identityPage = new IdentityPage(page);
    await identityPage.navigateToPage();
  });

  test('login form should work', async ({ page }) => {
    await identityPage.navigateToPage();

    // the submit button is named register
    // meaning that we managed to get to the register part of the page
    await expect(page.getByText(' Login ')).toBeTruthy();

    const username = await identityPage.getUsernameFormControlLocator();
    const password = await identityPage.getPasswordFormControlLocator();

    const expectedUsername = 'user';
    const expectedPassword = '!Ab12345';

    await username.fill(expectedUsername);
    await password.fill(expectedPassword);

    await expect(username).toHaveValue(expectedUsername);
    await expect(password).toHaveValue(expectedPassword);

    await expect(page.getByRole('button', { name: ' Login ' })).toBeEnabled();
  });

  test('pick register option', async ({ page }) => {
    await identityPage.navigateToPage();
    await identityPage.goToRegister();

    // the submit button is named register
    // meaning that we managed to get to the register part of the page
    await expect(page.getByText(' Register ')).toBeTruthy();

    const username = await identityPage.getUsernameFormControlLocator();
    const email = await identityPage.getEmailFormControlLocator();
    const password = await identityPage.getPasswordFormControlLocator();
    const confirm_password = await identityPage.getConfirmPasswordFormControlLocator();

    const expectedUsername = 'user';
    const expectedEmail = 'a@a.com';
    const expectedPassword = '!Ab12345';

    await username.fill(expectedUsername);
    await email.fill(expectedEmail);
    await password.fill(expectedPassword);
    await confirm_password.fill(expectedPassword);

    await expect(username).toHaveValue(expectedUsername);
    await expect(email).toHaveValue(expectedEmail);
    await expect(password).toHaveValue(expectedPassword);
    await expect(confirm_password).toHaveValue(expectedPassword);

    await expect(page.getByRole('button', { name: ' Register ' })).toBeEnabled();
  });
});

test('login to multiple accounts', async ({ page }) => {
  const authHelper = new AuthHelper(page);

  await authHelper.connectWithDefaultAccount();

  await expect(page.locator('app-navbar')).toBeVisible();

  await authHelper.logout();

  await expect(page.getByText(' Login ')).toBeTruthy();

  await authHelper.connectWithAccount(USERS.second_user);

  await expect(page.locator('app-navbar')).toBeVisible();
});
