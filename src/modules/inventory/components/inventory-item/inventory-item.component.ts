import { Component, Input, OnInit } from '@angular/core';
import { InventoryItem } from 'src/modules/inventory/models/responses/inventory-item';
import { InventoryRoutes } from '../../enums/inventory-routes';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { deselectItem, loadItemInit, selectItem } from '../../store/inventory/inventory.actions';
import { loadItemInitiated } from '../../../item/store/item.actions';
import { Observable } from 'rxjs';
import { selectItemById } from '../../store/inventory/inventory.selector';
import { Item } from '../../../item/models/responses/item';

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.css']
})
export class InventoryItemComponent implements OnInit {
 
  @Input()
  hasControls = true;

  @Input()
  isShort = false;

  @Input()
  small = false;

  @Input()
  itemId: string;

  @Input()
  item = new InventoryItem();

  private get ItemId() {
    if (this.item?.itemId) return this.item.itemId;
    return this.itemId;
  }

  item$: Observable<InventoryItem>;
  
  constructor(private navigationService: NavigationService, private store: Store<InventoryItem>, private itemStore: Store<Item>) {}
  
  ngOnInit() {
    this.item$ = this.store.select(selectItemById(this.ItemId));
    this.itemStore.dispatch(loadItemInitiated(this.ItemId));
    this.store.dispatch(loadItemInit(this.ItemId));
  }

  add() {
    this.selectItemOption(InventoryRoutes.Quantity);
  }

  drop() {
    this.selectItemOption(InventoryRoutes.Drop);
  }

  // Utils

  private async selectItemOption(route: string) {
    this.store.dispatch(selectItem(this.ItemId));
    if (!await this.navigationService.navigate(route, true)) this.store.dispatch(deselectItem());
  }
}
