import { Locator, Page } from "@playwright/test";
import { Item } from "src/modules/item/models/responses/item";
import { goToItems } from "e2e/utils/utils";
import { BasePage } from "./base.page";

export class ItemsPage extends BasePage {
    constructor(protected page: Page) {
        super(page);
    }

    // navigation
    async navigateToItemsPage() {
        await goToItems(this.page);
    }

    // entities
    async getItemsListLocator(): Promise<Locator> {
        return await this.page.locator('app-list-items');
    }

    async getItemsLocator(): Promise<Locator> {
        return await (
            await this.getItemsListLocator()
        ).locator('app-item');
    }

    async getItemLocator(itemName: string): Promise<Locator> {
        return await (
            await this.getItemsLocator()
        ).filter({
            has: this.page
                .getByTestId('item-name')
                .filter({ hasText: itemName })
        });
    }

    async getItemWithLocator(expectedItemName: string): Promise<{ item: Item, locator: Locator }> {
        const itemLocator = await (
            await this.getItemsLocator()
        ).filter({
            has: this.page
                .getByTestId('item-name')
                .filter({ hasText: expectedItemName })
        });

        const itemNameElement = await itemLocator.getByTestId('item-name');
        const itemName = await itemNameElement.getByTestId('item-name-value');
        const itemDescriptionElement = await itemLocator.getByTestId('item-description');
        const itemDescription = await itemDescriptionElement.getByTestId('item-description-value');

        let name = await itemName.textContent();
        let description = await itemDescription.textContent();

        return { item: new Item({ name, description }), locator: itemLocator };
    }

    // menu buttons

    async getCreateItemMenuButtonLocator(): Promise<Locator> {
        return await (
            await this.getMenuButtonsListLocator()
        ).nth(0)
         .getByRole('listitem');
    }

    // dialogs
    async getCreateItemDialogLocator(): Promise<Locator> {
        return await this.page.locator('dialog-create-item');
    }

    async getEditItemDialogLocator(): Promise<Locator> {
        return await this.page.locator('dialog-edit-item');
    }

    async getDeleteItemDialogLocator(): Promise<Locator> {
        return await this.page.locator('dialog-delete-item');
    }

    // dialog input controls
    async fillCreateItemDialogInputData(itemName: string, itemDescription: string): Promise<void> {
        await this.page.fill('input[formControlName="itemName"]', itemName);
        await this.page.fill('input[formControlName="itemDescription"]', itemDescription);
    }

    async fillCreateItemDialogItemName(itemName: string): Promise<void> {
        await this.page.fill('input[formControlName="itemName"]', itemName);
    }
}
