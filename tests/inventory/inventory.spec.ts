import test, { expect, Locator, Page } from "@playwright/test";
import { connectWithDefaultAccount, getButtonWithName, goToInventory } from "tests/utils/utils";

test.describe('List items tests', () => {
    test.beforeEach(async ({ page }) => {
        await connectWithDefaultAccount(page);
        await goToInventory(page);
    });

    test('should be able to see the inventory items list and validate the first inventory item data', async({ page }) => {
        let inventoryItemsListComponent = await page.locator('app-list-inventory');

        await expect(inventoryItemsListComponent).toHaveCount(1);

        await expect(inventoryItemsListComponent).toBeVisible();
        
        await expect(inventoryItemsListComponent).toBeAttached();

        const items = await inventoryItemsListComponent.locator('app-inventory-item');

        const itemsCount = await items.count();

        expect(itemsCount).toBeGreaterThan(0);

        const item = items.nth(0);

        await expect(item).toBeVisible();
        
        const itemNameElement = await item.getByTestId('item-name');
        const itemName = await itemNameElement.getByTestId('item-name-value');
        
        await expect(itemNameElement).toBeAttached();
        await expect(itemName).not.toBeEmpty();

        const itemQuantityElement = await item.getByTestId('item-quantity');
        
        await expect(itemQuantityElement).toBeAttached();

        const itemControlsElement = await item.getByTestId('item-controls');
        
        await expect(itemControlsElement).toBeAttached();
        await expect(itemControlsElement).toBeVisible();

        const itemAddButtonElement = await itemControlsElement.getByTestId('item-add-button');
        
        await expect(itemAddButtonElement).toBeAttached();
        await expect(itemAddButtonElement).toBeVisible();
        await expect(itemAddButtonElement).toBeEnabled();

        const itemDropButtonElement = await itemControlsElement.getByTestId('item-drop-button');
        
        await expect(itemDropButtonElement).toBeAttached();
        await expect(itemDropButtonElement).toBeVisible();
        await expect(itemDropButtonElement).toBeEnabled();
    });

    test('should be able to see the inventory items list and search by item name', async({ page }) => {
        let itemsListComponent = await page.locator('app-list-inventory');
    
        await expect(itemsListComponent).toBeVisible();
        await expect(itemsListComponent).toBeAttached();
    
        const items = await itemsListComponent.locator('app-inventory-item');
    
        const itemsCount = await items.count();
    
        expect(itemsCount).toBeGreaterThan(1);
    
        const firstItem = items.nth(0);
    
        await expect(firstItem).toBeVisible();
          
        const itemNameElement = await firstItem.getByTestId('item-name');
        const itemName = await itemNameElement.getByTestId('item-name-value');
    
        await expect(itemNameElement).toBeAttached();
        await expect(itemName).not.toBeEmpty();
        
        const itemNameText = (await itemName.textContent()).trim();
    
        let searchBarInput = await page.getByTestId('search-bar-input');
        await searchBarInput.fill(itemNameText);
        let searchBarButton = await page.getByTestId('search-bar-submit-button');
        await searchBarButton.click();
        
        const itemsAfterSearch = await getInventoryItems(page);
        const itemsAfterSearchCount = await itemsAfterSearch.count();
    
        expect(itemsAfterSearchCount).toBeGreaterThan(0);
    
        const listedItem = itemsAfterSearch.nth(0);
    
        await expect(listedItem).toBeVisible();
    
        const listedItemNameElement = await listedItem.getByTestId('item-name');
        const listedItemName = await listedItemNameElement.getByTestId('item-name-value');
      
        await expect(listedItemNameElement).toBeAttached();
        await expect(listedItemName).not.toBeEmpty();
    
        const listedItemNameText = (await itemName.textContent()).trim();
    
        expect(listedItemNameText).toBe(itemNameText);

        const listedItemQuantityElement = await listedItem.getByTestId('item-quantity');
        const listedItemQuantityInnerText = await listedItemQuantityElement.getByTestId('item-quantity-value').innerText();
        const listedItemQuantity = Number(listedItemQuantityInnerText);

        expect(listedItemQuantity).toBeGreaterThan(0);
    });

    test('should be able to search then clear the search input and then see the list of all items', async({ page }) => {
        let itemsListComponent = await page.locator('app-list-inventory');
    
        await expect(itemsListComponent).toBeVisible();
        await expect(itemsListComponent).toBeAttached();
    
        const items = await itemsListComponent.locator('app-inventory-item');
    
        const itemsCount = await items.count();
    
        expect(itemsCount).toBeGreaterThan(1);
    
        const firstItem = items.nth(0);
    
        await expect(firstItem).toBeVisible();
          
        const itemNameElement = await firstItem.getByTestId('item-name');
        const itemName = await itemNameElement.getByTestId('item-name-value');
    
        await expect(itemNameElement).toBeAttached();
        await expect(itemName).not.toBeEmpty();
        
        const itemNameText = (await itemName.textContent()).trim();
    
        let searchBarInput = await page.getByTestId('search-bar-input');
        await searchBarInput.fill(itemNameText);
        let searchBarButton = await page.getByTestId('search-bar-submit-button');
        await searchBarButton.click();
        
        const itemsAfterSearch = await getInventoryItems(page);
        const itemsAfterSearchCount = await itemsAfterSearch.count();
    
        expect(itemsAfterSearchCount).toBeGreaterThan(0);
    
        const listedItem = itemsAfterSearch.nth(0);
    
        await expect(listedItem).toBeVisible();
    
        const listedItemNameElement = await listedItem.getByTestId('item-name');
        const listedItemName = await listedItemNameElement.getByTestId('item-name-value');
      
        await expect(listedItemNameElement).toBeAttached();
        await expect(listedItemName).not.toBeEmpty();
    
        const listedItemNameText = (await itemName.textContent()).trim();
    
        expect(listedItemNameText).toBe(itemNameText);

        const listedItemQuantityElement = await listedItem.getByTestId('item-quantity');
        const listedItemQuantityInnerText = await listedItemQuantityElement.getByTestId('item-quantity-value').innerText();
        const listedItemQuantity = Number(listedItemQuantityInnerText);

        expect(listedItemQuantity).toBeGreaterThan(0);
    
        await searchBarInput.clear();
        await searchBarButton.click();
    
        const itemsAfterSearchingAll = await getInventoryItems(page);
    
        await expect(itemsAfterSearchingAll).toHaveCount(itemsCount);
      });
});

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

async function getInventoryItems(source: Page): Promise<Locator> {
  let inventoryItemsListComponent = await source.locator('app-list-inventory');

  return await inventoryItemsListComponent.locator('app-inventory-item');
}
