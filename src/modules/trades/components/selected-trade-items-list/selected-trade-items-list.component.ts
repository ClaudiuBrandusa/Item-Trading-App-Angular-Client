import { Component } from '@angular/core';
import { TradeItem } from '../../models/trade-item';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTradeItemIds } from '../../store/trade-item/trade-item.selector';
import { Trade } from '../../models/responses/trade';
import { selectCurrentTradeStatus } from '../../store/trade/trade.selector';

@Component({
  selector: 'app-selected-trade-items-list',
  templateUrl: './selected-trade-items-list.component.html',
  styleUrls: ['./selected-trade-items-list.component.css']
})
export class SelectedTradeItemsListComponent {
  
  tradeItemIdList$: Observable<string[]>;
  editAllowed = true;
  
  constructor(store: Store<TradeItem>, tradeStore: Store<Trade>) {
    this.tradeItemIdList$ = store.select(selectTradeItemIds);

    tradeStore.select(selectCurrentTradeStatus).subscribe(currentTrade => {
      this.editAllowed = !currentTrade.tradeId;
    });
  }
}
