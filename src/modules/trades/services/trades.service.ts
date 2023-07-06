import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EndpointsService } from '../../app/services/endpoints.service';
import { TradeEndpoints } from '../../shared/models/endpoints/trade-endpoints.config';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';
import { TradeResponse } from '../enums/trade-response';
import { AcceptTradeOfferRequest } from '../models/requests/accept-trade-offer.request';
import { RejectTradeOfferRequest } from '../models/requests/reject-trade-offer.request';
import { TradeOfferRequest } from '../models/requests/trade-offer.request';

@Injectable()
export class TradesService extends NetworkService<TradeEndpoints> {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService) {
    super(http, endpointsService, eventBus);
    this.endpointsModel = this.endpointsService.getTrade();
  }

  private filteringOptions: Array<string> = new Array<string>("All", "Sent", "Received");

  getFilteringOptions() {
    return this.filteringOptions;
  }

  getTrade(tradeId: string, isSentTrade: boolean, isRespondedTrade: boolean = false) {
    if (isSentTrade) {
      return this.getSentTrade(tradeId, isRespondedTrade);
    } else {
      return this.getReceivedTrade(tradeId, isRespondedTrade);
    }
  }

  getSentTrades(responded: Boolean = false) {
    const endpoint = this.base_path + (responded ? this.endpointsModel.list_sent_responded : this.endpointsModel.list_sent);

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getReceivedTrades(responded: Boolean = false) {
    const endpoint = this.base_path + (responded ? this.endpointsModel.list_received_responded : this.endpointsModel.list_received);

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getSentTrade(tradeId: string, responded: Boolean = false) {
    const endpoint = this.base_path + (responded ? this.endpointsModel.get_sent_responded : this.endpointsModel.get_sent) + `?tradeId=${tradeId}`;

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  getReceivedTrade(tradeId: string, responded: Boolean = false) {
    const endpoint = this.base_path + (responded ? this.endpointsModel.get_received_responded : this.endpointsModel.get_received) + `?tradeId=${tradeId}`;

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  sendTradeOffer(request: TradeOfferRequest) {
    return this.http.post(this.base_path + this.endpointsModel.offer, request).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  respondToTradeOffer(tradeId: string, response: TradeResponse) {
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
        const options = this.formatContentToRequestBody({
          tradeId
        });

        request = this.http.delete(this.base_path + this.endpointsModel.cancel, options);
        break;
      }
    }

    return request.pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }
}
