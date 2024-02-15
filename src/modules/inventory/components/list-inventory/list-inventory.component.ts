import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadItemsInit } from '../../store/inventory/inventory.actions';
import { InventoryItem } from '../../models/responses/inventory-item';
import { Observable } from 'rxjs';
import { selectInventoryItemIds } from '../../store/inventory/inventory.selector';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent implements OnInit {

  public itemIds$: Observable<string[]>;
  
  constructor(private store: Store<InventoryItem>) {
    this.itemIds$ = store.select(selectInventoryItemIds);
  }

  ngOnInit(): void {
    this.listItems();
  }

  listItems(searchString: string = "") {
    this.store.dispatch(loadItemsInit(searchString));
  }
}
