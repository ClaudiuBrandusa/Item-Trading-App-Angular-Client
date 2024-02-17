import { Component, OnInit } from '@angular/core';
import { TradesSearchOptions } from '../../models/trades-search-options';
import { TradeRoutes } from '../../enums/trade-routes';
import { Store } from '@ngrx/store';
import { TradeState } from '../../store/trade/trade.state';
import { createTradeInitiated, listTradesInit, loadTradeDirectionsInit } from '../../store/trade/trade.actions';
import { clearArray } from '../../../shared/utils/array-utils';
import { selectTradeDirections } from '../../store/trade/trade.selector';

@Component({
  selector: 'app-trades-page',
  templateUrl: './trades-page.component.html',
  styleUrls: ['./trades-page.component.css']
})
export class TradesPageComponent implements OnInit {
  selectedTradeItems = new Array<string>();
  filteringOptions = new Array<string>();
  searchOptions = new TradesSearchOptions();
  createTradeEventId = TradeRoutes.SelectReceiver;
  createTradeEventRoute = `${TradeRoutes.Create}/${TradeRoutes.SelectReceiver}`;

  constructor(private store: Store<TradeState>) {
    store.dispatch(loadTradeDirectionsInit());

    store.select(selectTradeDirections).subscribe((tradeDirections: Array<string>) =>
      {
        clearArray(this.filteringOptions);
        tradeDirections.forEach(tradeDirection => this.filteringOptions.push(tradeDirection));
      }
    );
  }

  ngOnInit() {
    this.search();
  }

  search() {
    const arr = new Array<string>();
    this.selectedTradeItems.forEach(itemName => arr.push(itemName));
    this.searchOptions.tradeItemIds = arr;
    
    this.store.dispatch(listTradesInit({ ...this.searchOptions }));
  }

  onCreateTradeClicked() {
    this.store.dispatch(createTradeInitiated());
  }

  onTradeItemsSelected(selectedTradeItems) {
    this.selectedTradeItems = selectedTradeItems;
  }
}
