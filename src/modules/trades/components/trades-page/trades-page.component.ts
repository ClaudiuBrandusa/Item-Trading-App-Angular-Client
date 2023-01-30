import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { TradeEvents } from '../../enums/trade-events';
import { TradesSearchOptions } from '../../models/trades-search-options';
import { TradesService } from '../../services/trades.service';

@Component({
  selector: 'app-trades-page',
  templateUrl: './trades-page.component.html',
  styleUrls: ['./trades-page.component.css']
})
export class TradesPageComponent implements OnInit, OnDestroy {
  filteringOptions: Array<string>;
  searchOptions: TradesSearchOptions;
  private eventBusUtility: EventBusUtils;

  constructor(eventBus: EventBusService, private service: TradesService) {
    this.eventBusUtility = new EventBusUtils(eventBus);
    this.filteringOptions = this.service.getFilteringOptions();
  }

  ngOnInit() {
    this.searchOptions = this.service.getSearchOptions();
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.eventBusUtility.clearSubscriptions();
  }

  search() {
    this.service.setSearchOptions(this.searchOptions);
    this.eventBusUtility.emit(TradeEvents.RefreshList, this.searchOptions);
  }

  // Subscriptions

  private initSubscriptions() {
    this.eventBusUtility.on(TradeEvents.Search, () => {
      this.search();
    });
  }
}
