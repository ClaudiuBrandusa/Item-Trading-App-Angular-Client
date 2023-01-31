import { Component } from '@angular/core';
import { InventoryDialogEvents } from 'src/modules/inventory/enums/InventoryDialogEvents';
import { InventoryService } from 'src/modules/inventory/services/inventory.service';
import { ItemService } from 'src/modules/item/services/item.service';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { BaseDialogComponent } from 'src/modules/shared/components/dialog/base-dialog/base-dialog.component';

@Component({
  selector: 'dialog-add-item-select',
  templateUrl: './add-item-select-dialog.component.html',
  styleUrls: ['./add-item-select-dialog.component.css']
})
export class AddItemSelectDialogComponent extends BaseDialogComponent {

  foundItems = new Array<string>();
  searchString = "";
  nextDialogId = InventoryDialogEvents.AddQuantity;

  constructor(protected eventBus: EventBusService, private itemService: ItemService, private inventoryService: InventoryService) { 
    super(eventBus);
    this.eventId = InventoryDialogEvents.AddSelect;
  }

  search() {
    // we are going to use the list method until we implement the search functionality on the API
    this.clearResults();
    
    if(this.searchString == "") {
      // then we just leave it empty
      return;
    }

    this.listItems();
  }

  select(id: string) {
    this.inventoryService.select(id);
    this.navigate(this.nextDialogId);
  }

  cancel() {
    this.exitDialog();
  }

  private clearResults() {
    while(this.foundItems.length > 0)
      this.foundItems.pop();
  }

  protected override onHide() {
    this.clearResults();
    this.searchString = '';
  }

  private listItems() {
    this.itemService.listItems(this.searchString).subscribe({
      next: (response) => {
        response.itemsId.forEach(id => {
          this.foundItems.push(id);
        });
      },
      error: (error) => {
        console.log('Error found at list items: ', error);
      }
    })
  }
}
