import { Component, OnInit } from '@angular/core';
import { TradesSearchOptions } from '../../models/trades-search-options';
import { TradesService } from '../../services/trades.service';
import { TradeRoutes } from '../../enums/trade-routes';
import { Store } from '@ngrx/store';
import { TradeState } from '../../store/trade/trade.state';
import { createTradeInitiated, listTradesInit } from '../../store/trade/trade.actions';

@Component({
  selector: 'app-trades-page',
  templateUrl: './trades-page.component.html',
  styleUrls: ['./trades-page.component.css']
})
export class TradesPageComponent implements OnInit {
  filteringOptions: Array<string>;
  searchOptions = new TradesSearchOptions();
  createTradeEventId = TradeRoutes.SelectReceiver;
  createTradeEventRoute = `${TradeRoutes.Create}/${TradeRoutes.SelectReceiver}`;

  constructor(private service: TradesService, private store: Store<TradeState>) {
    this.filteringOptions = this.service.getFilteringOptions();
  }

  ngOnInit() {
    this.search();
  }

  search() {
    this.store.dispatch(listTradesInit({ ...this.searchOptions }));
  }

  onCreateTradeClicked() {
    this.store.dispatch(createTradeInitiated());
  }
}
