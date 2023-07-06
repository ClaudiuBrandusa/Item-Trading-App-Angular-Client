import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Trade } from '../../models/responses/trade';
import { Observable } from 'rxjs';
import { selectTradeIds } from '../../store/trade/trade.selector';
import { TradeBaseData } from '../../models/trade-base-data';

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.css']
})
export class TradesListComponent {
  tradesData$: Observable<TradeBaseData[]>;
  
  constructor(store: Store<Trade>) {
    this.tradesData$ = store.select(selectTradeIds);
  }
}
