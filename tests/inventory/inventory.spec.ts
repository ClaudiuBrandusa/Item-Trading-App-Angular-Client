import test, { expect } from "@playwright/test";
import { connectWithDefaultAccount, getButtonWithName, goToInventory } from "tests/utils/utils";

test.describe('Add Item Menu Tests', () => {
    test.beforeEach(async ({ page }) => {
        await connectWithDefaultAccount(page);
        await goToInventory(page);
    });

    test('should select the `add item` menu item when clicked', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const addItemMenuButton = await menuButton.nth(0).getByRole('listitem');

        await addItemMenuButton.click();

        const classAttr = await addItemMenuButton.getAttribute('class');
        expect(classAttr).toBe('selected');
    });

    test('should deselect the `add item` menu item when the dialog is closed', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const addItemMenuButton = await menuButton.nth(0).getByRole('listitem');
        const dialog = await page.locator('dialog-add-item-select');
        const cancelButton = await getButtonWithName(dialog, 'Cancel');

        await addItemMenuButton.click();
        await cancelButton.click();

        const classAttr = await addItemMenuButton.getAttribute('class');
        expect(classAttr).toBe('');
    });

    test('should not allow searching an item to add without filling the item name search input', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
        const dialog = await page.locator('dialog-add-item-select');
        const searchButton = await getButtonWithName(dialog, 'Search');
        const cancelButton = await getButtonWithName(dialog, 'Cancel');

        await createItemMenuButton.click();
        await searchButton.click();

        await expect(dialog.locator('app-item')).toHaveCount(0);
        
        await cancelButton.click();
    });

    test('should allow searching an item to add by filling the correct item name in the search input', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
        const dialog = await page.locator('dialog-add-item-select');
        const searchButton = await getButtonWithName(dialog, 'Search');
        const cancelButton = await getButtonWithName(dialog, 'Cancel');
        const searchItemInput = await dialog.getByTestId('add-item-dialog-search-input');

        const expectedItemName = 'Iron';

        await createItemMenuButton.click();
        await searchItemInput.fill(expectedItemName);
        await searchButton.click();

        let appItems = await dialog.locator('app-item');

        await expect(appItems).not.toBeEmpty();

        await cancelButton.click();
    });

    test('should allow searching an item then selecting it and be able to go back', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
        const dialog = await page.locator('dialog-add-item-select');
        const searchButton = await getButtonWithName(dialog, 'Search');
        const cancelButton = await getButtonWithName(dialog, 'Cancel');
        const searchItemInput = await dialog.getByTestId('add-item-dialog-search-input');

        const expectedItemName = 'Iron';

        await createItemMenuButton.click();
        await searchItemInput.fill(expectedItemName);
        await searchButton.click();

        let appItems = await dialog.locator('app-item');

        await expect(appItems).not.toBeEmpty();

        const foundItem = await appItems.nth(0);

        await foundItem.click();

        const nextDialog = await page.locator('dialog-add-item-quantity');

        await expect(nextDialog).toBeAttached();
        
        const nextDialogCancelButton = await getButtonWithName(nextDialog, 'Cancel');

        await nextDialogCancelButton.click();
        await cancelButton.click();
    });

    test('should allow searching an item then selecting it', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
        const dialog = await page.locator('dialog-add-item-select');
        const searchButton = await getButtonWithName(dialog, 'Search');
        const searchItemInput = await dialog.getByTestId('add-item-dialog-search-input');

        const expectedItemName = 'Iron';

        await createItemMenuButton.click();
        await searchItemInput.fill(expectedItemName);
        await searchButton.click();

        let appItems = await dialog.locator('app-item');

        await expect(appItems).not.toBeEmpty();

        const foundItem = await appItems.nth(0);

        await foundItem.click();

        const nextDialog = await page.locator('dialog-add-item-quantity');

        await expect(nextDialog).toBeAttached();
    });

    test('should allow searching an item and selecting it then setting a quantity', async ({ page }) => {
        const menuButton = await page.locator('app-menu-button');
        const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
        const dialog = await page.locator('dialog-add-item-select');
        const searchButton = await getButtonWithName(dialog, 'Search');
        const searchItemInput = await dialog.getByTestId('add-item-dialog-search-input');

        const expectedItemName = 'Iron';

        await createItemMenuButton.click();
        await searchItemInput.fill(expectedItemName);
        await searchButton.click();

        let appItems = await dialog.locator('app-item');

        await expect(appItems).not.toBeEmpty();

        const foundItem = await appItems.nth(0);

        await foundItem.click();

        const nextDialog = await page.locator('dialog-add-item-quantity');

        await expect(nextDialog).toBeAttached();

        const nextButton = await getButtonWithName(nextDialog, 'Next');

        await expect(nextButton.isDisabled()).toBeTruthy();

        const expectedQuantity = 10;

        const quantityInput = await nextDialog.getByTestId('add-item-dialog-quantity-input');
        await quantityInput.fill(expectedQuantity.toString());

        await expect(nextButton.isEnabled()).toBeTruthy();

        await nextButton.click();

        const inventoryItems = await page.locator('app-inventory-item');
        const inventoryItem = await inventoryItems.nth(0);

        await expect(inventoryItem).toBeAttached();
        await expect(inventoryItem).toBeVisible();
    });
});