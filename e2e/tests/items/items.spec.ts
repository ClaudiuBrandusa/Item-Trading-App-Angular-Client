import { test, expect } from '@playwright/test';
import { expectMenuButtonToBeSelected, expectMenuButtonToNotBeSelected } from 'e2e/utils/assertions/menu-button.assertions';
import { AuthHelper } from 'e2e/utils/helpers/auth.helper';
import { SearchBarHelper } from 'e2e/utils/helpers/search-bar.helper';
import { ItemsPage } from 'e2e/utils/pages/items.page';
import { getButtonWithName } from 'e2e/utils/utils';

test.describe('List items tests', () => {
  let itemsPage: ItemsPage;
  let searchBarHelper: SearchBarHelper;
  let authHelper: AuthHelper;
    
  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    itemsPage = new ItemsPage(page);
    searchBarHelper = new SearchBarHelper(page);
    
    await authHelper.connectWithDefaultAccount();
    await itemsPage.navigateToItemsPage();
  });

  test('should be able to see the items list and validate each item data', async () => {
    let itemsListComponent = await itemsPage.getItemsListLocator();

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

  test('should be able to see the items list and search by item name', async () => {
    let itemsListComponent = await itemsPage.getItemsListLocator();

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

    let searchBarInput = await searchBarHelper.getSearchBarInputLocator();
    await searchBarInput.fill(itemNameText);
    let searchBarButton = await searchBarHelper.getSearchBarSubmitButtonLocator();
    await searchBarButton.click();
    
    const itemsAfterSearch = await itemsPage.getItemsLocator();
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

  test('should be able to search then clear the search input and then see the list of all items', async () => {
    let itemsListComponent = await itemsPage.getItemsListLocator();

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

    let searchBarInput = await searchBarHelper.getSearchBarInputLocator();
    await searchBarInput.fill(itemNameText);
    let searchBarButton = await searchBarHelper.getSearchBarSubmitButtonLocator();
    await searchBarButton.click();
    
    const itemsAfterSearch = await itemsPage.getItemsLocator();
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

    const itemsAfterSearchingAll = await itemsPage.getItemsLocator();

    await expect(itemsAfterSearchingAll).toHaveCount(itemsCount);
  });
});

test.describe('Create Item Menu Item Tests', () => {
  let itemsPage: ItemsPage;
  let authHelper: AuthHelper;
  
  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    itemsPage = new ItemsPage(page);

    await authHelper.connectWithDefaultAccount();
    await itemsPage.navigateToItemsPage();
  });

  test('should select the `create item` menu item when clicked', async () => {
    const createItemMenuButton = await itemsPage.getCreateItemMenuButtonLocator();

    await createItemMenuButton.click();

    expectMenuButtonToBeSelected(createItemMenuButton);
  });

  test('should deselect the `create item` menu item when the dialog is closed', async () => {
    const createItemMenuButton = await itemsPage.getCreateItemMenuButtonLocator();
    const dialog = await itemsPage.getCreateItemDialogLocator();
    const cancelButton = await getButtonWithName(dialog, 'Cancel');

    await createItemMenuButton.click();
    await cancelButton.click();

    expectMenuButtonToNotBeSelected(createItemMenuButton);
  });

  test('should not allow creating an item with invalid data', async () => {
    const createItemMenuButton = await itemsPage.getCreateItemMenuButtonLocator();
    const dialog = await itemsPage.getCreateItemDialogLocator();
    const createButton = await getButtonWithName(dialog, 'Create');
    const cancelButton = await getButtonWithName(dialog, 'Cancel');

    await createItemMenuButton.click();

    expect(createButton.isDisabled()).toBeTruthy();

    await cancelButton.click();
  });

  test('should create an item with valid data (no description) and delete it', async () => {
    const createItemMenuButton = await itemsPage.getCreateItemMenuButtonLocator();
    const dialog = await itemsPage.getCreateItemDialogLocator();
    const createButton = await getButtonWithName(dialog, 'Create');

    const inputItemName = 'Test Item 0';

    await createItemMenuButton.click();
    await itemsPage.fillCreateItemDialogItemName(inputItemName);
    await createButton.click();

    const {
      item: createdItem,
      locator: createdItemLocator
    } = await itemsPage.getItemWithLocator(inputItemName);
  
    // currently the api returns '  ' instead of empty or undefined when no description was provided
    expect(createdItem.description).toBe('  ');

    const deleteButton = await createdItemLocator.getByTestId('item-delete-button');
    await deleteButton.click();

    const deleteItemDialog = await itemsPage.getDeleteItemDialogLocator();
    const deleteButtonConfirm = await getButtonWithName(deleteItemDialog, 'Yes');
    await deleteButtonConfirm.click();

    const itemsAfterDelete = await itemsPage.getItemLocator(inputItemName);
    await expect(itemsAfterDelete).toHaveCount(0);
  });

  test('should create an item with valid data (with description) and delete it', async () => {
    const createItemMenuButton = await itemsPage.getCreateItemMenuButtonLocator();
    const dialog = await itemsPage.getCreateItemDialogLocator();
    const createButton = await getButtonWithName(dialog, 'Create');

    const inputItemName = 'Test Item 1';
    const inputDescriptionName = 'This is a test description';

    await createItemMenuButton.click();
    await itemsPage.fillCreateItemDialogInputData(inputItemName, inputDescriptionName);
    await createButton.click();

    const {
      item: createdItem,
      locator: createdItemLocator
    } = await itemsPage.getItemWithLocator(inputItemName);

    expect(createdItem.description).toBe(` ${inputDescriptionName} `);

    const deleteButton = await createdItemLocator.getByTestId('item-delete-button');
    await deleteButton.click();

    const deleteItemDialog = await itemsPage.getDeleteItemDialogLocator();
    const deleteButtonConfirm = await getButtonWithName(deleteItemDialog, 'Yes');
    await deleteButtonConfirm.click();

    const itemsAfterDelete = await itemsPage.getItemLocator(inputItemName);
    await expect(itemsAfterDelete).toHaveCount(0);
  });

  test('should create an item with valid data and update its name and description then delete it', async () => {
    const createItemMenuButton = await itemsPage.getCreateItemMenuButtonLocator();
    const dialog = await itemsPage.getCreateItemDialogLocator();
    const createButton = await getButtonWithName(dialog, 'Create');

    const inputItemName = 'Test Item 2';
    const inputDescriptionName = 'This is a test description';

    await createItemMenuButton.click();
    await itemsPage.fillCreateItemDialogInputData(inputItemName, inputDescriptionName);
    await createButton.click();

    const {
      item: createdItem,
      locator: createdItemLocator
    } = await itemsPage.getItemWithLocator(inputItemName);

    expect(createdItem.name).toBe(` ${inputItemName} `);
    expect(createdItem.description).toBe(` ${inputDescriptionName} `);

    const updatedItemName = 'Updated Test Item';
    const updatedDescriptionName = 'This is the updated description';

    const updateButton = await createdItemLocator.getByTestId('item-edit-button');
    await updateButton.click();

    const updateItemDialog = await itemsPage.getEditItemDialogLocator();
    await itemsPage.fillCreateItemDialogInputData(updatedItemName, updatedDescriptionName);
    const updateButtonConfirm = await getButtonWithName(updateItemDialog, 'Update');
    await updateButtonConfirm.click();

    const deleteButton = await createdItemLocator.getByTestId('item-delete-button');
    await deleteButton.click();

    const deleteItemDialog = await itemsPage.getDeleteItemDialogLocator();
    const deleteButtonConfirm = await getButtonWithName(deleteItemDialog, 'Yes');
    await deleteButtonConfirm.click();

    const itemsAfterDelete = await await itemsPage.getItemLocator(inputItemName);
    await expect(itemsAfterDelete).toHaveCount(0);
  });
});
