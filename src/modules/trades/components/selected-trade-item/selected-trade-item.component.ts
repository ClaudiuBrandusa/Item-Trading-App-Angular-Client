import { Component, Input, OnInit } from '@angular/core';
import { TradePopupNames } from '../../enums/trade-popup-names';
import { TradeItem } from '../../models/trade-item';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Store } from '@ngrx/store';
import { selectTradeItemById } from '../../store/trade-item/trade-item.selector';
import { Observable, map } from 'rxjs';
import { selectTradeItem } from '../../store/trade-item/trade-item.actions';

@Component({
  selector: 'app-selected-trade-item',
  templateUrl: './selected-trade-item.component.html',
  styleUrls: ['./selected-trade-item.component.css']
})
export class SelectedTradeItemComponent implements OnInit {

  @Input()
  itemId: string;

  @Input()
  editable: boolean;

  item = new TradeItem();
  item$: Observable<TradeItem>;
  
  constructor(private navigationService: NavigationService, private store: Store<TradeItem>) {}

  ngOnInit() {
    this.item$ = this.store.select(selectTradeItemById(this.itemId)).pipe(map(item => {
      this.item = item;
      return item;
    }));
  
    this.item$.subscribe();
  }

  edit() {
    if (this.editable) {
      this.store.dispatch(selectTradeItem({ ...this.item }));
      this.navigationService.openPopup(TradePopupNames.SetItemQuantityAndPrice);
    }
  }

  remove() {
    if (this.editable) {
      this.store.dispatch(selectTradeItem({ ...this.item }));
      this.navigationService.openPopup(TradePopupNames.RemoveItem);
    }
  }
}
