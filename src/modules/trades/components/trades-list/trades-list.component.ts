import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListDirective } from 'src/modules/shared/directives/list/list.directive';
import { EventBusService } from '../../../shared/services/event-bus.service';
import { EventBusUtils } from '../../../shared/utils/event-bus.utility';
import { TradeEvents } from '../../enums/trade-events';
import { TradesSearchOptions } from '../../models/trades-search-options';
import { TradesService } from '../../services/trades.service';
import { TradesListResponse } from '../../models/responses/trades-list.response'

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.css']
})
export class TradesListComponent extends ListDirective implements OnInit, OnDestroy {

  private eventBusUtility: EventBusUtils;
  
  constructor(eventBus: EventBusService, private service: TradesService) {
    super();
    this.eventBusUtility = new EventBusUtils(eventBus);
  }

  ngOnInit(): void {
    this.initSubscriptions();
    this.eventBusUtility.emit(TradeEvents.Search, null);
  }

  ngOnDestroy(): void {
    this.eventBusUtility.clearSubscriptions();
  }

  listTrades(searchOptions: TradesSearchOptions) {
    this.clear();
    this.service.clearCachedTrades();

    if (searchOptions.selectedFilterValue === "All" || searchOptions.selectedFilterValue === "Sent") {
      this.service.getSentTrades(searchOptions.showRespondedTrades).subscribe({
        next: (response) => {
          this.handleTradesResponse(response, true, searchOptions.showRespondedTrades);
        },
        error: (error) => {
          console.log(`Error found at loading the sent trades: ${error}`);
        }
      });
    }

    if (searchOptions.selectedFilterValue === "All" || searchOptions.selectedFilterValue === "Received") {
      this.service.getReceivedTrades(searchOptions.showRespondedTrades).subscribe({
        next: (response) => {
          this.handleTradesResponse(response, false, searchOptions.showRespondedTrades);
        },
        error: (error) => {
          console.log(`Error found at loading the received trades: ${error}`);
        }
      });
    }
  }

  private handleTradesResponse(response, sent: boolean, responded: boolean) {
    const tradesList = response as TradesListResponse;

    if (tradesList.tradeOffersIds.length > 0) {
      this.addList(tradesList.tradeOffersIds, true);
      this.service.cacheTrades(tradesList.tradeOffersIds, sent, responded);
    }
  }

  // Subscriptions

  private initSubscriptions() {
    this.eventBusUtility.on(TradeEvents.RefreshList, async (data: TradesSearchOptions) => {
      this.listTrades(data);
    });

    this.eventBusUtility.on(TradeEvents.Create, (tradeId: string) => {
      this.service.cacheTrade(tradeId, true, false);
      this.add(tradeId);
    });

    this.eventBusUtility.on(TradeEvents.Update, (tradeId: string) => {
      var searchOptions = this.service.getSearchOptions();
      
      if(this.service.isRespondedTrade(tradeId) && !searchOptions.showRespondedTrades) {
        this.remove(tradeId);
      }
    });

    this.eventBusUtility.on(TradeEvents.Remove, (tradeId: string) => {
      this.remove(tradeId);
    });
  }
}
