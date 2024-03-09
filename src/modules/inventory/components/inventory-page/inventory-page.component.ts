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

  search(searchString: string) {
    this.store.dispatch(loadItemsInit(searchString));
  }
}
