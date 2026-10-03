import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { goToInventory } from "../utils";

export class InventoryPage extends BasePage {
    constructor(protected page: Page) {
        super(page);
    }
    
    // navigation
    async navigateToPage() {
        await goToInventory(this.page);
    }

    // entities
    async getInventoryItemsListLocator(): Promise<Locator> {
        return await this.page.locator('app-list-inventory');
    }

    async getInventoryItemsLocator(): Promise<Locator> {
        return await (
            await this.getInventoryItemsListLocator()
        ).locator('app-inventory-item');
    }

    // menu buttons
    async getAddInventoryItemMenuButtonLocator(): Promise<Locator> {
        return await (
            await this.getMenuButtonsListLocator()
        ).nth(0)
            .getByRole('listitem');
    }

    // dialog
    async getAddInventoryItemSelectDialogLocator(): Promise<Locator> {
        return await this.page.locator('dialog-add-item-select');
    }

    async getAddInventoryItemQuantityDialogLocator(): Promise<Locator> {
        return await this.page.locator('dialog-add-item-quantity');
    }
}