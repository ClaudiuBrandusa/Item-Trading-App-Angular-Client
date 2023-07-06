import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { NavigationService } from '../../../shared/services/navigation.service';
import { ItemRoutes } from '../../enums/item-routes';
import { Store } from '@ngrx/store';
import { deselectItem, loadItemInitiated, selectItem } from '../../store/item.actions';
import { selectItemById } from '../../store/item.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input()
  itemId: string;

  @Input()
  hasControls = true;

  @Input()
  isShort = false;

  @Input()
  onItemLoadedFunction: (item: Item) => void;

  @Input()
  small = false;

  public item$ = new Observable<Item>();

  constructor(private navigationService: NavigationService, private store: Store) {}
  
  ngOnInit(): void {
    this.item$ = this.store.select(selectItemById(this.itemId));
    this.store.dispatch(loadItemInitiated(this.itemId));
  }

  edit() {
    this.select(ItemRoutes.Edit);
  }

  delete() {
    this.select(ItemRoutes.Delete);
  }

  details() {
    this.select(ItemRoutes.Details);
  }

  // Utils

  private async select(route: string) {
    this.store.dispatch(selectItem(this.itemId));
    if (!await this.navigationService.navigate(route, true)) this.store.dispatch(deselectItem());
  }
}
