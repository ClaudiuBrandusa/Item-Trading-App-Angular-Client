import { Component } from '@angular/core';
import { InventoryRoutes } from '../../enums/inventory-routes';
import { InventoryItem } from '../../models/responses/inventory-item';
import { Store } from '@ngrx/store';
import { loadItemsInit } from '../../store/inventory/inventory.actions';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent {

  addItemEventId = InventoryRoutes.Select;

  constructor(private store: Store<InventoryItem>) {}

  search(searchBody) {
    this.store.dispatch(loadItemsInit(searchBody.searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }
}
