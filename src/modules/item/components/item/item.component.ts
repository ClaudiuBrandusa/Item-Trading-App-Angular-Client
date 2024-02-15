import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/modules/item/models/responses/item';
import { NavigationService } from '../../../shared/services/navigation.service';
import { ItemRoutes } from '../../enums/item-routes';
import { Store } from '@ngrx/store';
import { deselectItem, loadItemInitiated, selectItem } from '../../store/item/item.actions';
import { selectItemById } from '../../store/item/item.selector';
import { Observable } from 'rxjs';
import { loadTradesUsingTheItemInit } from '../../store/item_used/item_used.actions';
import { selectItemUsedById } from '../../store/item_used/item_used.selector';
import { clearArray } from '../../../shared/utils/array-utils';
import { PopupNames } from '../../../../standalone/popups/enums/popup-names';

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
  private tradesUsingThisItemLoading = true;
  private tradesUsingThisItem = new Array<string>();

  constructor(private navigationService: NavigationService, private store: Store) {}
  
  ngOnInit(): void {
    this.item$ = this.store.select(selectItemById(this.itemId));
    this.store.dispatch(loadItemInitiated(this.itemId));
    this.store.dispatch(loadTradesUsingTheItemInit(this.itemId));
    this.store.select(selectItemUsedById(this.itemId)).subscribe(itemUsed => {
      clearArray(this.tradesUsingThisItem);
      
      itemUsed?.tradeIds.forEach(tradeId => this.tradesUsingThisItem.push(tradeId));
      
      this.tradesUsingThisItemLoading = false;
    });
  }

  edit() {
    this.select(ItemRoutes.Edit);
  }

  delete() {
    if (this.tradesUsingThisItemLoading) return;
    
    if (this.tradesUsingThisItem.length > 0) {
      this.navigationService.openPopup(PopupNames.Warning);
      return;
    }

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
