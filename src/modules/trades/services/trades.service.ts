import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { TradeEndpoints } from '../../shared/models/endpoints/trade-endpoints.config';
import { ConfigService } from '../../shared/services/config.service';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';
import { TradeResponse } from '../enums/trade-response';
import { CurrentTrade } from '../models/current-trade';
import { AcceptTradeOfferRequest } from '../models/requests/accept-trade-offer.request';
import { RejectTradeOfferRequest } from '../models/requests/reject-trade-offer.request';
import { TradeOfferRequest } from '../models/requests/trade-offer.request';
import { TradeItem } from '../models/trade-item';
import { TradesSearchOptions } from '../models/trades-search-options';

@Injectable()
export class TradesService extends NetworkService<TradeEndpoints> {

  constructor(protected http: HttpClient, protected configService: ConfigService, protected injector: Injector, protected eventBus: EventBusService, protected router: Router) {
    super(http, configService, injector, eventBus);
    this.currentTrade = new CurrentTrade({ tradeItems: new Array<TradeItem>() });
  }

  protected async SetEndpointsModel() {
    this.endpointsModel = await this.endpointsService.GetTrade();
  }

  protected async LoadEndpoints() {
    await this.waitUntilIsLoaded();

    if(this.endpointsModel == null)
      return;
  }

  private currentTrade: CurrentTrade;
  private tradeOffer: TradeOfferRequest = new TradeOfferRequest({ items: new Array<TradeItem>() });
  // we use this in order to better access the selected trade items ids
  private selectedTradeItemsIds = new Array<string>();
  private tradeIdsMap = new Map<string, [boolean, boolean]>();
  private filteringOptions: Array<string> = new Array<string>("All", "Sent", "Received");
  private searchOptions = new TradesSearchOptions({ selectedFilterValue: this.filteringOptions[0], showRespondedTrades: false });

  getSearchOptions() {
    return JSON.parse(JSON.stringify(this.searchOptions));
  }

  setSearchOptions(searchOptions: TradesSearchOptions) {
    this.searchOptions = JSON.parse(JSON.stringify(searchOptions));;
  }

  getFilteringOptions() {
    return this.filteringOptions;
  }

  getCurrentTrade() {
    if (this.currentTrade.isSentTrade) {
      return this.getSentTrade(this.currentTrade.tradeId, this.currentTrade.isRespondedTrade);
    } else {
      return this.getReceivedTrade(this.currentTrade.tradeId, this.currentTrade.isRespondedTrade);
    }
  }

  getTrade(tradeId: string) {
    const tradeData = this.tradeIdsMap.get(tradeId);
    if (tradeData?.[0]) {
      return this.getSentTrade(tradeId, tradeData?.[1]);
    } else {
      return this.getReceivedTrade(tradeId, tradeData?.[1]);
    }
  }

  async getSentTrades(responded: Boolean = false) {
    await this.waitUntilIsLoaded();

    const endpoint = this.base_path + (responded ? this.endpointsModel.list_sent_responded : this.endpointsModel.list_sent);

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async getReceivedTrades(responded: Boolean = false) {
    await this.waitUntilIsLoaded();

    const endpoint = this.base_path + (responded ? this.endpointsModel.list_received_responded : this.endpointsModel.list_received);

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async getSentTrade(tradeId: string, responded: Boolean = false) {
    await this.waitUntilIsLoaded();

    const endpoint = this.base_path + (responded ? this.endpointsModel.get_sent_responded : this.endpointsModel.get_sent) + `?tradeId=${tradeId}`;

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async getReceivedTrade(tradeId: string, responded: Boolean = false) {
    await this.waitUntilIsLoaded();

    const endpoint = this.base_path + (responded ? this.endpointsModel.get_received_responded : this.endpointsModel.get_received) + `?tradeId=${tradeId}`;

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async sendTradeOffer() {
    await this.waitUntilIsLoaded();
    
    return this.http.post(this.base_path + this.endpointsModel.offer, this.tradeOffer).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  async respondToTradeOffer(tradeId: string, response: TradeResponse) {
    await this.waitUntilIsLoaded();

    let request: Observable<Object>;
    switch(response) {
      case TradeResponse.Accept: {
        const body = new AcceptTradeOfferRequest();
        body.tradeId = tradeId;
        request = this.http.patch(this.base_path + this.endpointsModel.accept, body);
        break;
      }
      case TradeResponse.Reject: {
        const body = new RejectTradeOfferRequest();
        body.tradeId = tradeId;
        request = this.http.patch(this.base_path + this.endpointsModel.reject, body);
        break;
      }
      case TradeResponse.Cancel: {
        const options = this.getOptions({
          tradeId
        });

        request = this.http.delete(this.base_path + this.endpointsModel.cancel, options);
        break;
      }
    }

    return request.pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  cacheTrades(tradeIds: Array<string>, sentTrades: boolean, respondedTrades: boolean) {
    tradeIds.forEach(tradeId => this.tradeIdsMap.set(tradeId, [sentTrades, respondedTrades]));
  }

  cacheTrade(tradeId: string, sentTrade: boolean, respondedTrade: boolean) {
    this.tradeIdsMap.set(tradeId, [sentTrade, respondedTrade]);
  }

  clearCachedTrades() {
    this.tradeIdsMap.clear();
  }

  select(tradeId: string, tradeItems: Array<TradeItem>) {
    const tradeData = this.tradeIdsMap.get(tradeId);

    this.currentTrade.tradeId = tradeId;
    this.currentTrade.tradeItems = tradeItems;
    this.currentTrade.isSentTrade = tradeData?.[0] as boolean;
    this.currentTrade.isRespondedTrade = tradeData?.[1] as boolean;
  }

  deselect() {
    this.currentTrade.tradeId = "";
    this.currentTrade.tradeItems.splice(0);
  }
  
  setTradeOfferReceiver(userId: string) {
    this.tradeOffer.targetUserId = userId;
  }

  addItemToTradeOffer(item: TradeItem) {
    this.tradeOffer.items.push(item);
    this.selectedTradeItemsIds.push(item.id);
  }

  isTradeOfferValid() {
    return !!this.tradeOffer.targetUserId && this.tradeOffer.items.length > 0
  }

  getTradeItemById(itemId: string) {
    if (this.tradeOffer.items.length > 0)
      return this.tradeOffer.items.find(item => item.id === itemId);
    else
      return this.currentTrade.tradeItems.find(item => item.id === itemId);
  }

  removeItemByIdFromTradeOffer(itemId: string) {
    let index = this.tradeOffer.items.findIndex(item => item.id === itemId);
    this.tradeOffer.items.splice(index, 1);
    index = this.selectedTradeItemsIds.findIndex(id => id === itemId);
    this.selectedTradeItemsIds.splice(index, 1);
  }

  isTradeItemIdSelected(itemId: string) {
    return this.selectedTradeItemsIds.includes(itemId);
  }

  getCurrentTradeOffer() {
    return this.tradeOffer.targetUserId == "" ? null : this.tradeOffer;
  }

  clearCurrentTradeOffer() {
    this.clearTradeItemsOfTradeOffer();

    this.tradeOffer.targetUserId = "";
  }

  clearTradeItemsOfTradeOffer() {
    while(this.tradeOffer.items.length > 0)
      this.tradeOffer.items.pop();

    while(this.selectedTradeItemsIds.length > 0)
      this.selectedTradeItemsIds.pop();
  }

  isSentTrade(tradeId: string) {
    return this.tradeIdsMap.get(tradeId)?.[0] as boolean;
  }

  isRespondedTrade(tradeId: string) {
    return this.tradeIdsMap.get(tradeId)?.[1] as boolean;
  }

  getSelectedTrade() {
    return this.currentTrade;
  }

  getCurrentTradeItemsIds() {
    return this.currentTrade.tradeItems.map(x => x.id);
  }

  private currentTradeItem: TradeItem;

  setCurrentTradeItem(tradeItem: TradeItem) {
    this.currentTradeItem = tradeItem;
  }

  getCurrentTradeItem() {
    return this.currentTradeItem;
  }
}
