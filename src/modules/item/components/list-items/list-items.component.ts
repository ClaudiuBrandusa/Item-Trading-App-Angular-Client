import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadItemsInitiated } from '../../store/item.actions';
import { selectItemIds } from '../../store/item.selector';
import { Item } from '../../models/responses/item';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent implements OnInit {
  public itemIds$ = this.store.select(selectItemIds);

  constructor(private store: Store<Item>) {}

  ngOnInit(): void {
    this.listItems();
  }

  listItems(searchString: string = "") {
    this.store.dispatch(loadItemsInitiated(searchString));
  }
}
