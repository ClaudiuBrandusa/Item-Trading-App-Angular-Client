import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService } from '../../shared/services/network.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { IdentityEndpoints } from '../../shared/models/endpoints/identity-endpoints.config';
import { EndpointsService } from '../../app/services/endpoints.service';
import { AuthenticationResponse } from '../models/responses/authentication.response';

@Injectable()
export abstract class IdentityService extends NetworkService<IdentityEndpoints> {

  constructor(protected http: HttpClient, protected endpointsService: EndpointsService, protected navigationService: NavigationService) {
    super(endpointsService);
    this.endpointsModel = this.endpointsService.getIdentity();
   }

  setTokens(response: AuthenticationResponse) {
    this.clearTokens();
    
    var somethingWentWrong = false;
    
    try {
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("expirationDateTime", response.expirationDateTime.toString());
    } catch{
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
  protected onTokenSet(_authenticationResponse: AuthenticationResponse) {}
}
