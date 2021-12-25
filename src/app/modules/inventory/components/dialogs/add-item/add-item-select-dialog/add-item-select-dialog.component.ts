import { Component } from '@angular/core';
import { InventoryDialogEvents } from 'src/app/modules/inventory/enums/InventoryDialogEvents';
import { InventoryService } from 'src/app/modules/inventory/services/inventory.service';
import { ItemService } from 'src/app/modules/item/services/item.service';
import { BaseNavigableDialogComponent } from 'src/app/modules/shared/components/dialog/base-navigable-dialog/base-navigable-dialog.component';
import { EventBusService } from 'src/app/modules/shared/services/event-bus.service';
import { NavigationStackService } from 'src/app/modules/shared/services/navigation-stack.service';

@Component({
  selector: 'dialog-add-item-select',
  templateUrl: './add-item-select-dialog.component.html',
  styleUrls: ['./add-item-select-dialog.component.css']
})
export class AddItemSelectDialogComponent extends BaseNavigableDialogComponent {

  foundItems = new Array<string>();

  searchString = "";

  nextPageId = InventoryDialogEvents.AddQuantity;

  constructor(protected eventBus: EventBusService, protected navigationStack: NavigationStackService, private itemService: ItemService, private inventoryService: InventoryService) { 
    super(eventBus, navigationStack);
    this.eventId = InventoryDialogEvents.AddSelect;
  }

  async search() {
    // we are going to use the list method until we implement the search functionality on the API
    this.clearResults();
    
    if(this.searchString == "") {
      // then we just leave it empty
      return;
    }

    let result = await this.itemService.listItems();

    if(result == null)
      return;

    result.forEach(id => {
      this.foundItems.push(id);
    });
  }

  select(id: string) {
    this.inventoryService.select(id);
    this.navigate(this.nextPageId);
  }

  cancel() {
    this.cancelDialog();
  }

  private clearResults() {
    while(this.foundItems.length > 0)
      this.foundItems.pop();
  }

}
