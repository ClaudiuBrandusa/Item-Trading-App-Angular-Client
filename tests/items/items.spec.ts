import { test, expect, Locator, Page } from '@playwright/test';
import { Item } from 'src/modules/item/models/responses/item';
import { connectWithDefaultAccount, getButtonWithName, goToItems } from 'tests/utils/utils';

test.describe('List items tests', () => {
  test.beforeEach(async ({ page }) => {
    await connectWithDefaultAccount(page);
    await goToItems(page);
  });

  test('should be able to see the items list and validate each item data', async({ page }) => {
    let itemsListComponent = await page.locator('app-list-items');

    await expect(itemsListComponent).toHaveCount(1);

    await expect(itemsListComponent).toBeVisible();
    
    await expect(itemsListComponent).toBeAttached();

    const items = await itemsListComponent.locator('app-item');

    const itemsCount = await items.count();

    expect(itemsCount).toBeGreaterThan(1);

    for (let i = 0; i < itemsCount; i++) {
      const item = items.nth(i);

      await expect(item).toBeVisible();
      
      const itemNameElement = await item.getByTestId('item-name');
      const itemName = await itemNameElement.getByTestId('item-name-value');
      
      await expect(itemNameElement).toBeAttached();
      await expect(itemName).not.toBeEmpty();

      const itemDescriptionElement = await item.getByTestId('item-description');
      
      await expect(itemDescriptionElement).toBeAttached();

      const itemControlsElement = await item.getByTestId('item-controls');
    
      await expect(itemControlsElement).toBeAttached();
      await expect(itemControlsElement).toBeVisible();
    }
  });

  test('should be able to see the items list and search by item name', async({ page }) => {
    let itemsListComponent = await page.locator('app-list-items');

    await expect(itemsListComponent).toHaveCount(1);
    await expect(itemsListComponent).toBeVisible();
    await expect(itemsListComponent).toBeAttached();

    const items = await itemsListComponent.locator('app-item');

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
    
    const itemsAfterSearch = await getItems(page);
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
  });

  test('should be able to search then clear the search input and then see the list of all items', async({ page }) => {
    let itemsListComponent = await page.locator('app-list-items');

    await expect(itemsListComponent).toHaveCount(1);
    await expect(itemsListComponent).toBeVisible();
    await expect(itemsListComponent).toBeAttached();

    const items = await itemsListComponent.locator('app-item');

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
    
    const itemsAfterSearch = await getItems(page);
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

    await searchBarInput.clear();
    await searchBarButton.click();

    const itemsAfterSearchingAll = await getItems(page);
    const itemsAfterSearchingAllCount = await itemsAfterSearchingAll.count();

    expect(itemsAfterSearchingAllCount).toBe(itemsCount);
  });
});

test.describe('Create Item Menu Item Tests', () => {
  test.beforeEach(async ({ page }) => {
    await connectWithDefaultAccount(page);
    await goToItems(page);
  });

  test('should select the `create item` menu item when clicked', async ({ page }) => {
    const menuButton = await page.locator('app-menu-button');
    const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');

    await createItemMenuButton.click();

    const classAttr = await createItemMenuButton.getAttribute('class');
    expect(classAttr).toBe('selected');
  });

  test('should deselect the `create item` menu item when the dialog is closed', async ({ page }) => {
    const menuButton = await page.locator('app-menu-button');
    const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
    const dialog = await page.locator('dialog-create-item');
    const cancelButton = await getButtonWithName(dialog, 'Cancel');

    await createItemMenuButton.click();
    await cancelButton.click();

    const classAttr = await createItemMenuButton.getAttribute('class');
    expect(classAttr).toBe('');
  });

  test('should not allow creating an item with invalid data', async ({ page }) => {
    const menuButton = await page.locator('app-menu-button');
    const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
    const dialog = await page.locator('dialog-create-item');
    const createButton = await getButtonWithName(dialog, 'Create');
    const cancelButton = await getButtonWithName(dialog, 'Cancel');

    await createItemMenuButton.click();

    expect(createButton.isDisabled()).toBeTruthy();

    await cancelButton.click();
  });

  test('should create an item with valid data (no description) and delete it', async ({ page }) => {
    const menuButton = await page.locator('app-menu-button');
    const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
    const dialog = await page.locator('dialog-create-item');
    const createButton = await getButtonWithName(dialog, 'Create');

    const inputItemName = 'Test Item 0';

    await createItemMenuButton.click();
    await page.fill('input[formControlName="itemName"]', inputItemName);
    await createButton.click();

    const items = await getItems(page);
    const {
      item: createdItem,
      locator: createdItemLocator
    } = await getItem(page, items, inputItemName);
  
    // currently the api returns '  ' instead of empty or undefined when no description was provided
    expect(createdItem.description).toBe('  ');

    const deleteButton = await createdItemLocator.getByTestId('item-delete-button');
    await deleteButton.click();

    const deleteItemDialog = await page.locator('dialog-delete-item');
    const deleteButtonConfirm = await getButtonWithName(deleteItemDialog, 'Yes');
    await deleteButtonConfirm.click();

    await page.waitForTimeout(200);

    const itemsAfterDelete = await getItems(page);
    await expect(await countItemsWithName(page, itemsAfterDelete, inputItemName)).toBe(0);
  });

  test('should create an item with valid data (with description) and delete it', async ({ page }) => {
    const menuButton = await page.locator('app-menu-button');
    const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
    const dialog = await page.locator('dialog-create-item');
    const createButton = await getButtonWithName(dialog, 'Create');

    const inputItemName = 'Test Item 1';
    const inputDescriptionName = 'This is a test description';

    await createItemMenuButton.click();
    await page.fill('input[formControlName="itemName"]', inputItemName);
    await page.fill('input[formControlName="itemDescription"]', inputDescriptionName);
    await createButton.click();

    const items = await getItems(page);
    const {
      item: createdItem,
      locator: createdItemLocator
    } = await getItem(page, items, inputItemName);

    expect(createdItem.description).toBe(` ${inputDescriptionName} `);

    const deleteButton = await createdItemLocator.getByTestId('item-delete-button');
    await deleteButton.click();

    const deleteItemDialog = await page.locator('dialog-delete-item');
    const deleteButtonConfirm = await getButtonWithName(deleteItemDialog, 'Yes');
    await deleteButtonConfirm.click();

    await page.waitForTimeout(200);

    const itemsAfterDelete = await getItems(page);
    await expect(await countItemsWithName(page, itemsAfterDelete, inputItemName)).toBe(0);
  });

  test('should create an item with valid data and update its name and description then delete it', async ({ page }) => {
    const menuButton = await page.locator('app-menu-button');
    const createItemMenuButton = await menuButton.nth(0).getByRole('listitem');
    const dialog = await page.locator('dialog-create-item');
    const createButton = await getButtonWithName(dialog, 'Create');

    const inputItemName = 'Test Item 2';
    const inputDescriptionName = 'This is a test description';

    await createItemMenuButton.click();
    await page.fill('input[formControlName="itemName"]', inputItemName);
    await page.fill('input[formControlName="itemDescription"]', inputDescriptionName);
    await createButton.click();

    const items = await getItems(page);
    const {
      item: createdItem,
      locator: createdItemLocator
    } = await getItem(page, items, inputItemName);

    expect(createdItem.name).toBe(` ${inputItemName} `);
    expect(createdItem.description).toBe(` ${inputDescriptionName} `);

    const updatedItemName = 'Updated Test Item';
    const updatedDescriptionName = 'This is the updated description';

    const updateButton = await createdItemLocator.getByTestId('item-edit-button');
    await updateButton.click();

    const updateItemDialog = await page.locator('dialog-edit-item');
    await page.fill('input[formControlName="itemName"]', updatedItemName);
    await page.fill('input[formControlName="itemDescription"]', updatedDescriptionName);
    const updateButtonConfirm = await getButtonWithName(updateItemDialog, 'Update');
    await updateButtonConfirm.click();

    const deleteButton = await createdItemLocator.getByTestId('item-delete-button');
    await deleteButton.click();

    const deleteItemDialog = await page.locator('dialog-delete-item');
    const deleteButtonConfirm = await getButtonWithName(deleteItemDialog, 'Yes');
    await deleteButtonConfirm.click();

    await page.waitForTimeout(200);

    const itemsAfterDelete = await getItems(page);
    await expect(await countItemsWithName(page, itemsAfterDelete, inputItemName)).toBe(0);
  });
});

async function getItems(source: Page): Promise<Locator> {
  let itemsListComponent = await source.locator('app-list-items');

  return await itemsListComponent.locator('app-item');
}

async function getItem(page: Page, items: Locator, expectedItemName: string): Promise<{ item: Item, locator: Locator }> {
  const itemLocator = await filterItemLocator(page, items, expectedItemName);
  
  const itemNameElement = await itemLocator.getByTestId('item-name');
  const itemName = await itemNameElement.getByTestId('item-name-value');
  const itemDescriptionElement = await itemLocator.getByTestId('item-description');
  const itemDescription = await itemDescriptionElement.getByTestId('item-description-value');

  let name = await itemName.textContent();
  let description = await itemDescription.textContent();

  return { item: new Item({ name, description }), locator: itemLocator };
}

async function filterItemLocator(page: Page, items: Locator, expectedItemName: string): Promise<Locator> {
  return await items.filter({
    has: page.getByTestId('item-name').filter({ hasText: expectedItemName })
  });
}

async function countItemsWithName(page: Page, items: Locator, itemName: string): Promise<number> {
  return (await filterItemLocator(page, items, itemName)).count();
}
