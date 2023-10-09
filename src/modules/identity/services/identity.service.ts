import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventBusService } from '../../shared/services/event-bus.service';
import { NetworkService } from '../../shared/services/network.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { EventData } from '../../shared/utils/event-data';
import { IdentityEndpoints } from '../../shared/models/endpoints/identity-endpoints.config';
import { EndpointsService } from '../../app/services/endpoints.service';
import { SignalR } from '../../shared/enums/signal-r.enum';

@Injectable()
export abstract class IdentityService extends NetworkService<IdentityEndpoints> {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected eventBus: EventBusService, protected navigationService: NavigationService) {
    super(endpointsService);
    this.endpointsModel = this.endpointsService.getIdentity();
   }

  setTokens(response: Object) {
    this.clearTokens();
    
    var somethingWentWrong = false;
      
    if(response.hasOwnProperty("token")) {
      localStorage.setItem("token", (<any>response).token);
    } else {
      somethingWentWrong = true;
    }

    if(response.hasOwnProperty("refreshToken")) {
      localStorage.setItem("refreshToken", (<any>response).refreshToken);
    } else {
      somethingWentWrong = true;
    }

    if(response.hasOwnProperty("expirationDateTime")) {
      localStorage.setItem("expirationDateTime", (<any>response).expirationDateTime);
    } else {
      somethingWentWrong = true;
    }

    if(!somethingWentWrong)
    {
      this.onTokenSet(response);
    } else {
      this.redirectToDefaultPage();
    }

    return !somethingWentWrong;
  }

  protected clearTokens() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expirationDateTime");
  }

  protected redirectToDefaultPage() {
    this.navigationService.redirect("");
  }
  
  /** Gets called when the token is set */
  protected onTokenSet(tokenResponseObject: Object) {
    this.eventBus.emit(new EventData(SignalR.Connected, (<any>tokenResponseObject).token));
    this.redirectToDefaultPage();
  }
}
