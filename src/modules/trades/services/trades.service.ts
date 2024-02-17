import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EndpointsService } from '../../app/services/endpoints.service';
import { TradeEndpoints } from '../../shared/models/endpoints/trade-endpoints.config';
import { NetworkService } from '../../shared/services/network.service';
import { TradeResponse } from '../enums/trade-response';
import { AcceptTradeOfferRequest } from '../models/requests/accept-trade-offer.request';
import { RejectTradeOfferRequest } from '../models/requests/reject-trade-offer.request';
import { TradeOfferRequest } from '../models/requests/trade-offer.request';

@Injectable()
export class TradesService extends NetworkService<TradeEndpoints> {

  constructor(private http: HttpClient, protected endpointsService: EndpointsService) {
    super(endpointsService);
    this.endpointsModel = this.endpointsService.getTrade();
  }

  getTrade(tradeId: string) {
    const endpoint = this.base_path + this.endpointsModel.get;

    const params = this.getQueryParamsFromObject({
      tradeId
    });

    return this.http.get(endpoint, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }

  loadTradeIds(direction: string, tradeItemIds: string[], responded: Boolean = false) {
    const endpoint = this.base_path + this.endpointsModel.list;
    
    const params = this.getQueryParamsFromObject({
      direction,
      tradeItemIds,
      responded
    });
    
    return this.http.get(endpoint, { params }).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
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

  loadTradeDirections() {
    const endpoint = this.base_path + this.endpointsModel.directions;

    return this.http.get(endpoint).pipe(catchError((error) => throwError(() => (this.buildError(error)))));
  }
}
