import { Component } from '@angular/core';
import { NavigationService } from '../../../shared/services/navigation.service';
import { InventoryRoutes } from '../../enums/inventory-routes';
import { Store } from '@ngrx/store';
import { Item } from '../../../item/models/responses/item';
import { InventoryItem } from '../../models/responses/inventory-item';
import { selectItem } from '../../store/inventory/inventory.actions';
import { clearSearchedItems, loadItemsInitiated } from '../../../item/store/item/item.actions';
import { selectItemIds } from '../../../item/store/item/item.selector';

@Component({
  selector: 'dialog-add-item-select',
  templateUrl: './add-item-select-dialog.component.html',
  styleUrls: ['./add-item-select-dialog.component.css']
})
export class AddItemSelectDialogComponent {

  public foundItemIds$ = this.itemStore.select(selectItemIds);
  searchString = "";
  initSearch = false;

  constructor(private navigationService: NavigationService, private store: Store<InventoryItem>, private itemStore: Store<Item>) {}

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
    this.store.dispatch(selectItem(id));
    await this.navigationService.navigate(`../${InventoryRoutes.Quantity}`, true);
  }

  cancel() {
    this.navigationService.back();
  }

  private clearResults() {
    this.itemStore.dispatch(clearSearchedItems());
  }

  private listItems() {
    this.initSearch = true;
    this.itemStore.dispatch(loadItemsInitiated(this.searchString));
  }

  onSearchStringChange() {
    if (this.searchString === "") {
      this.clearResults();
    }
  }
}
