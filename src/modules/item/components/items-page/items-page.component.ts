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

  search(searchBody) {
    this.store.dispatch(loadItemsInitiated(searchBody.searchString));
  }

  getEventValue(event: Event) {
    let str = event as unknown as string;
    if(str != null)
      return str;
    return (event.target as HTMLInputElement).value;
  }

  onSelectItemClicked(_event) {
    this.store.dispatch(createItemInitiated());
  }
}
