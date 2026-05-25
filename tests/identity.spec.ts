import { test, expect } from '@playwright/test';

test('login form should work', async({ page }) => {
  await page.goto('/');

  // the submit button is named register
  // meaning that we managed to get to the register part of the page
  await expect(page.getByText(' Login ')).toBeTruthy();

  const username = page.locator('[formcontrolname="username"]');
  const password = page.locator('[formcontrolname="password"]');

  let expectedUsername = 'user';
  let expectedPassword = '!Ab12345';

  await username.fill(expectedUsername);
  await password.fill(expectedPassword);

  await expect(username).toHaveValue(expectedUsername);
  await expect(password).toHaveValue(expectedPassword);

  await expect(page.getByRole('button', { name: ' Login ' })).toBeEnabled();
});

test('pick register option', async({ page }) => {
  await page.goto('/');
  await page.click('text=Register');

  // the submit button is named register
  // meaning that we managed to get to the register part of the page
  await expect(page.getByText(' Register ')).toBeTruthy();

  const username = page.locator('[formcontrolname="username"]');
  const email = page.locator('[formcontrolname="email"]');
  const password = page.locator('[formcontrolname="password"]');
  const confirm_password = page.locator('[formcontrolname="confirm_password"]');

  let expectedUsername = 'user';
  let expectedEmail = 'a@a.com';
  let expectedPassword = '!Ab12345';

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
