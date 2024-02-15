import { Component, OnDestroy } from '@angular/core';
import { Trade } from '../../models/responses/trade';
import { getTradeReceiverOrSender } from '../../utils/trade-utils';
import { NavigationService } from '../../../shared/services/navigation.service';
import { currentTradeSelectionTerminated } from '../../store/trade/trade.actions';
import { Store } from '@ngrx/store';
import { selectedTrade, selectCurrentTradeStatus } from '../../store/trade/trade.selector';
import { Observable, map } from 'rxjs';
import { TradeItem } from '../../models/trade-item';
import { discardTradeItems } from '../../store/trade-item/trade-item.actions';

@Component({
  selector: 'dialog-trade-details',
  templateUrl: './trade-details-dialog.component.html',
  styleUrls: ['./trade-details-dialog.component.css']
})
export class TradeDetailsDialogComponent implements OnDestroy {

  trade: Trade;
  trade$: Observable<Trade>;
  isSentTrade: boolean;
  userName: string;
  totalPrice: number;

  constructor(private navigationService: NavigationService, private store: Store<Trade>, private tradeItemStore: Store<TradeItem>) {
    store.select(selectCurrentTradeStatus).subscribe(currentTrade => {
      if (!currentTrade) return;
      this.isSentTrade = currentTrade.isSentTrade;
    });

    this.trade$ = this.store.select(selectedTrade).pipe(map(trade => {
      if (!trade) return new Trade();
      this.trade = trade as Trade;
      const userName = getTradeReceiverOrSender(trade);
      this.userName = userName;
      this.totalPrice = 0;
      trade.items.forEach(item => this.totalPrice += item.price);
      return trade;
    }));

    this.trade$.subscribe();
  }
  
  ngOnDestroy() {
    this.store.dispatch(currentTradeSelectionTerminated());
    this.tradeItemStore.dispatch(discardTradeItems());
  }

  exit() {
    this.navigationService.back();
  }
}
