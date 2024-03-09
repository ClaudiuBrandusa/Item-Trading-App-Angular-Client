import { Component } from '@angular/core';
import { ItemRoutes } from '../../enums/item-routes';
import { Store } from '@ngrx/store';
import { createItemInitiated, loadItemsInitiated } from '../../store/item/item.actions';
import { Item } from '../../models/responses/item';

@Component({
  selector: 'app-items',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.css']
})
export class ItemsComponent {

  createEventId = ItemRoutes.Create

  constructor(private store: Store<Item>) {}

  search(searchString: string) {
    this.store.dispatch(loadItemsInitiated(searchString));
  }

  onSelectItemClicked(_event) {
    this.store.dispatch(createItemInitiated());
  }
}
