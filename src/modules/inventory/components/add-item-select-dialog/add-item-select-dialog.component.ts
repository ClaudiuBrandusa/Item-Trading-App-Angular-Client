import { Component } from '@angular/core';
import { InventoryService } from 'src/modules/inventory/services/inventory.service';
import { ItemService } from 'src/modules/item/services/item.service';
import { EventBusService } from 'src/modules/shared/services/event-bus.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import { InventoryRoutes } from '../../enums/inventory-routes';

@Component({
  selector: 'dialog-add-item-select',
  templateUrl: './add-item-select-dialog.component.html',
  styleUrls: ['./add-item-select-dialog.component.css']
})
export class AddItemSelectDialogComponent {

  foundItems = new Array<string>();
  searchString = "";

  constructor(protected eventBus: EventBusService, private itemService: ItemService, private inventoryService: InventoryService, private navigationService: NavigationService) {}

  search() {
    // we are going to use the list method until we implement the search functionality on the API
    this.clearResults();
    
    if(this.searchString == "") {
      // then we just leave it empty
      return;
    }

    this.listItems();
  }

  async select(id: string) {
    this.inventoryService.select(id);
    this.inventoryService.selectItemState = false;
    await this.navigationService.navigate(`../${InventoryRoutes.Quantity}`, true);
  }

  cancel() {
    this.inventoryService.selectItemState = false;
    this.navigationService.back();
  }

  private clearResults() {
    while(this.foundItems.length > 0)
      this.foundItems.pop();
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
